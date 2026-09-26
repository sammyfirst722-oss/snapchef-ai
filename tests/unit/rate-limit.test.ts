import { describe, it, expect, vi, beforeEach } from 'vitest'
import { rateLimit, getClientIp, _resetRateLimitsForTesting } from '@/lib/rate-limit'
import { NextRequest } from 'next/server'

const { mockPipeline } = vi.hoisted(() => {
  const mockPipeline = {
    zremrangebyscore: vi.fn().mockReturnThis(),
    zcard: vi.fn().mockReturnThis(),
    zadd: vi.fn().mockReturnThis(),
    expire: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue([null, 0, null, null]),
  }
  return { mockPipeline }
})

vi.mock('@upstash/redis', () => {
  class MockRedis {
    constructor(_config?: any) {}
    pipeline = vi.fn(() => mockPipeline)
    static fromEnv = vi.fn(() => {
      throw new Error('Upstash Redis not configured in environment')
    })
  }
  return {
    Redis: MockRedis,
  }
})

describe('lib/rate-limit.ts Unit Tests', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    delete process.env.KV_REST_API_URL
    delete process.env.KV_REST_API_TOKEN
    mockPipeline.exec.mockResolvedValue([null, 0, null, null])
    _resetRateLimitsForTesting()
  })

  describe('In-memory sliding window rate limiter (Redis unconfigured)', () => {
    it('allows requests within limit and tracks remaining quota', async () => {
      const res1 = await rateLimit('test-ip-1', 3, 60)
      expect(res1.success).toBe(true)
      expect(res1.limit).toBe(3)
      expect(res1.remaining).toBe(2)
      expect(res1.reset).toBeGreaterThan(0)

      const res2 = await rateLimit('test-ip-1', 3, 60)
      expect(res2.success).toBe(true)
      expect(res2.remaining).toBe(1)

      const res3 = await rateLimit('test-ip-1', 3, 60)
      expect(res3.success).toBe(true)
      expect(res3.remaining).toBe(0)
    })

    it('blocks requests once limit is reached', async () => {
      // 2 requests allowed
      await rateLimit('test-ip-blocked', 2, 60)
      await rateLimit('test-ip-blocked', 2, 60)

      // 3rd request blocked
      const blocked = await rateLimit('test-ip-blocked', 2, 60)
      expect(blocked.success).toBe(false)
      expect(blocked.limit).toBe(2)
      expect(blocked.remaining).toBe(0)
      expect(blocked.reset).toBeGreaterThan(Math.floor(Date.now() / 1000))
    })

    it('isolates different keys independently', async () => {
      await rateLimit('ip-a', 1, 60)
      const resA = await rateLimit('ip-a', 1, 60)
      expect(resA.success).toBe(false)

      const resB = await rateLimit('ip-b', 1, 60)
      expect(resB.success).toBe(true)
      expect(resB.remaining).toBe(0)
    })

    it('allows requests again after sliding window expires', async () => {
      const now = Date.now()
      const dateSpy = vi.spyOn(Date, 'now')

      dateSpy.mockReturnValue(now)
      const res1 = await rateLimit('ip-sliding', 1, 10)
      expect(res1.success).toBe(true)

      // Immediate second request fails
      const res2 = await rateLimit('ip-sliding', 1, 10)
      expect(res2.success).toBe(false)

      // Fast forward 11 seconds past window
      dateSpy.mockReturnValue(now + 11_000)
      const res3 = await rateLimit('ip-sliding', 1, 10)
      expect(res3.success).toBe(true)
      expect(res3.remaining).toBe(0)

      dateSpy.mockRestore()
    })
  })

  describe('Distributed Redis rate limiter', () => {
    it('uses Upstash Redis pipeline when credentials are configured', async () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example-upstash.io'
      process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token'

      mockPipeline.exec.mockResolvedValueOnce([null, 2, null, null]) // 2 requests already

      const result = await rateLimit('redis-user', 5, 60)

      expect(mockPipeline.zremrangebyscore).toHaveBeenCalledWith('snapchef:ratelimit:redis-user', 0, expect.any(Number))
      expect(mockPipeline.zcard).toHaveBeenCalledWith('snapchef:ratelimit:redis-user')
      expect(mockPipeline.zadd).toHaveBeenCalledWith('snapchef:ratelimit:redis-user', expect.objectContaining({ score: expect.any(Number) }))
      expect(mockPipeline.expire).toHaveBeenCalledWith('snapchef:ratelimit:redis-user', 60)

      expect(result.success).toBe(true)
      expect(result.limit).toBe(5)
      expect(result.remaining).toBe(2) // 5 - 2 - 1 = 2
    })

    it('blocks request when Redis count equals or exceeds limit', async () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example-upstash.io'
      process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token'

      mockPipeline.exec.mockResolvedValueOnce([null, 5, null, null]) // 5 already in window

      const result = await rateLimit('redis-user-full', 5, 60)

      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('falls back to in-memory rate limiter when Redis throws an error', async () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example-upstash.io'
      process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token'

      mockPipeline.exec.mockRejectedValueOnce(new Error('Upstash connection reset'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await rateLimit('redis-err-ip', 3, 60)

      expect(consoleSpy).toHaveBeenCalled()
      expect(result.success).toBe(true)
      expect(result.limit).toBe(3)
      expect(result.remaining).toBe(2)

      consoleSpy.mockRestore()
    })
  })

  describe('getClientIp', () => {
    it('extracts primary IP from comma-separated x-forwarded-for header', () => {
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
        },
      })
      expect(getClientIp(req)).toBe('203.0.113.195')
    })

    it('extracts IP from x-real-ip header if x-forwarded-for is missing', () => {
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-real-ip': '198.51.100.42',
        },
      })
      expect(getClientIp(req)).toBe('198.51.100.42')
    })

    it('extracts IP from cf-connecting-ip header if other headers are missing', () => {
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'cf-connecting-ip': '192.0.2.1',
        },
      })
      expect(getClientIp(req)).toBe('192.0.2.1')
    })

    it('falls back to 127.0.0.1 if no IP headers are present', () => {
      const req = new NextRequest('http://localhost:3000/api/test')
      expect(getClientIp(req)).toBe('127.0.0.1')
    })
  })
})

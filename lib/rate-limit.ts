import { Redis } from '@upstash/redis'
import { NextRequest } from 'next/server'

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// In-memory sliding window fallback when Upstash Redis is not configured
interface MemoryRecord {
  timestamps: number[]
}
const memoryStore = new Map<string, MemoryRecord>()

// Periodically clean up stale memory store entries (older than 10 minutes)
const CLEANUP_INTERVAL_MS = 60_000
let lastCleanup = Date.now()

function cleanupMemoryStore(now: number, maxAgeSeconds: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  const cutoff = now - maxAgeSeconds * 1000
  for (const [key, record] of memoryStore.entries()) {
    record.timestamps = record.timestamps.filter((ts) => ts > cutoff)
    if (record.timestamps.length === 0) {
      memoryStore.delete(key)
    }
  }
}

// Lazy-initialize Redis
let _redis: Redis | null = null
let _redisChecked = false

function getRedis(): Redis | null {
  if (_redisChecked) return _redis
  _redisChecked = true

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

  if (url && token) {
    try {
      _redis = new Redis({ url, token })
      return _redis
    } catch (err) {
      console.warn('[rate-limit] Failed to initialize Upstash Redis, falling back to in-memory store:', err)
      return null
    }
  }

  // Check Redis.fromEnv() if standard env vars exist
  try {
    _redis = Redis.fromEnv()
    return _redis
  } catch {
    // Upstash Redis not configured in environment
    return null
  }
}

/**
 * In-memory sliding window rate limiter
 */
function memoryRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now()
  const windowStart = now - windowSeconds * 1000

  cleanupMemoryStore(now, windowSeconds * 2)

  let record = memoryStore.get(identifier)
  if (!record) {
    record = { timestamps: [] }
    memoryStore.set(identifier, record)
  }

  // Evict timestamps outside the window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart)

  const count = record.timestamps.length
  const success = count < limit

  if (success) {
    record.timestamps.push(now)
  }

  const remaining = Math.max(0, limit - (count + (success ? 1 : 0)))
  const oldestTimestamp = record.timestamps[0] || now
  const reset = Math.ceil((oldestTimestamp + windowSeconds * 1000) / 1000)

  return {
    success,
    limit,
    remaining,
    reset,
  }
}

/**
 * Distributed rate limiter with in-memory fallback.
 * Uses Upstash Redis sorted sets if available, in-memory sliding window otherwise.
 *
 * @param identifier Unique key (e.g. `scan-fridge:${ip}`)
 * @param limit Max requests allowed in window
 * @param windowSeconds Time window in seconds (default: 60)
 */
export async function rateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowStart = now - windowSeconds * 1000
  const redis = getRedis()

  if (!redis) {
    return memoryRateLimit(identifier, limit, windowSeconds)
  }

  const key = `snapchef:ratelimit:${identifier}`

  try {
    const pipeline = redis.pipeline()
    // Remove expired entries outside the sliding window
    pipeline.zremrangebyscore(key, 0, windowStart)
    // Count active entries in current window
    pipeline.zcard(key)
    // Add current request timestamp
    pipeline.zadd(key, { score: now, member: `${now}:${Math.random().toString(36).substring(2, 9)}` })
    // Ensure key expires after window
    pipeline.expire(key, windowSeconds)

    const results = await pipeline.exec()
    const count = (results[1] as number) || 0

    const success = count < limit
    const remaining = Math.max(0, limit - count - 1)
    const reset = Math.ceil((now + windowSeconds * 1000) / 1000)

    return {
      success,
      limit,
      remaining,
      reset,
    }
  } catch (error) {
    console.error('[rate-limit] Upstash Redis request failed, using in-memory fallback:', error)
    // Per money-in-sleep rules: do not fail open silently without limits — fall back to in-memory limiter
    return memoryRateLimit(identifier, limit, windowSeconds)
  }
}

/**
 * Extracts client IP address from Next.js request headers
 */
export function getClientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }
  const xRealIp = req.headers.get('x-real-ip')
  if (xRealIp) {
    return xRealIp.trim()
  }
  const cfConnectingIp = req.headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp.trim()
  }
  return '127.0.0.1'
}

/**
 * Resets stores for testing
 */
export function _resetRateLimitsForTesting(): void {
  memoryStore.clear()
  _redis = null
  _redisChecked = false
}

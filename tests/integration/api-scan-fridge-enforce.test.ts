import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/scan-fridge/route'
import { rateLimit } from '@/lib/rate-limit'
import { _setKvForTesting, issueEntitlement, PRO_COOKIE, VISITOR_COOKIE } from '@/lib/entitlements'
import { makeFakeKv } from '../helpers/fake-kv'

vi.mock('@/lib/rate-limit', async () => {
  const actual = await vi.importActual<typeof import('@/lib/rate-limit')>('@/lib/rate-limit')
  return { ...actual, rateLimit: vi.fn() }
})

const allow = { success: true, limit: 5, remaining: 4, reset: Math.floor(Date.now() / 1000) + 60 }
const deny = { success: false, limit: 3, remaining: 0, reset: Math.floor(Date.now() / 1000) + 3600 }

function req(cookie?: string) {
  return new NextRequest('http://localhost:3000/api/scan-fridge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(cookie ? { cookie } : {}) },
    body: JSON.stringify({}), // no image: a request that passes the limits ends in 400 "No image provided"
  })
}

describe('scan-fridge: server-side free cap (SERVER_PRO_ENFORCE)', () => {
  const originalEnv = process.env
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    vi.mocked(rateLimit).mockResolvedValue(allow)
    _setKvForTesting(makeFakeKv())
  })
  afterEach(() => {
    process.env = originalEnv
    _setKvForTesting(null)
  })

  it('does nothing new while the flag is off (free visitor reaches the normal checks)', async () => {
    delete process.env.SERVER_PRO_ENFORCE
    const res = await POST(req())
    expect(res.status).toBe(400)
    const keys = vi.mocked(rateLimit).mock.calls.map((c) => c[0])
    expect(keys.some((k) => k.includes('freevid'))).toBe(false)
    expect(res.headers.get('set-cookie') || '').not.toContain(VISITOR_COOKIE)
  })

  it('free visitor: counted per visitor cookie, and a visitor cookie is handed out', async () => {
    process.env.SERVER_PRO_ENFORCE = 'true'
    const res = await POST(req())
    expect(res.status).toBe(400)
    expect(vi.mocked(rateLimit).mock.calls.some((c) => c[0].startsWith('scan-fridge:freevid:v_'))).toBe(true)
    expect(res.headers.get('set-cookie')).toContain(VISITOR_COOKIE)
  })

  it('free visitor over the cap gets 429 with a clear code', async () => {
    process.env.SERVER_PRO_ENFORCE = 'true'
    vi.mocked(rateLimit).mockImplementation(async (key: string) => (key.startsWith('scan-fridge:freevid:') ? deny : allow))
    const res = await POST(req())
    expect(res.status).toBe(429)
    expect((await res.json()).code).toBe('free_limit_reached')
  })

  it('Pro visitor skips the free cap', async () => {
    process.env.SERVER_PRO_ENFORCE = 'true'
    const issued = (await issueEntitlement({ source: 'stripe', plan: 'lifetime', paidThrough: null, index: { cs: 'cs_test_x' } })) as any
    vi.mocked(rateLimit).mockImplementation(async (key: string) => (key.includes('free') ? deny : allow))
    const res = await POST(req(`${PRO_COOKIE}=${issued.token}`))
    expect(res.status).toBe(400) // passed every limit, stopped only by the empty body
  })

  it('a made-up Pro cookie does not skip the cap', async () => {
    process.env.SERVER_PRO_ENFORCE = 'true'
    vi.mocked(rateLimit).mockImplementation(async (key: string) => (key.includes('free') ? deny : allow))
    const res = await POST(req(`${PRO_COOKIE}=pro_${'A'.repeat(43)}`))
    expect(res.status).toBe(429)
  })
})

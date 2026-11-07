import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const retrieve = vi.fn()
vi.mock('stripe', () => ({ default: class { checkout = { sessions: { retrieve } } } }))
vi.mock('@/lib/rate-limit', async () => {
  const actual = await vi.importActual<typeof import('@/lib/rate-limit')>('@/lib/rate-limit')
  return { ...actual, rateLimit: vi.fn().mockResolvedValue({ success: true, limit: 20, remaining: 19, reset: 0 }) }
})

import { POST } from '@/app/api/stripe/verify-session/route'
import { _setKvForTesting, lookupToken, PRO_COOKIE } from '@/lib/entitlements'
import { makeFakeKv } from '../helpers/fake-kv'
import { _setFunnelStoreForTesting } from '@/lib/funnel'

const SID = 'cs_test_abcdefghij1234567890'
const paid = (extra: object = {}) => ({
  id: SID,
  status: 'complete',
  payment_status: 'paid',
  mode: 'payment',
  created: Math.floor(Date.now() / 1000),
  metadata: { app: 'snapchef' },
  payment_intent: 'pi_v1',
  ...extra,
})
const call = () =>
  POST(new NextRequest('http://localhost:3000/api/stripe/verify-session', { method: 'POST', body: JSON.stringify({ sessionId: SID }) }))

describe('POST /api/stripe/verify-session (server memory)', () => {
  const originalEnv = process.env
  beforeEach(() => {
    process.env = { ...originalEnv, STRIPE_SECRET_KEY: 'sk_test_x' }
    delete process.env.SERVER_PRO_ENFORCE
    retrieve.mockReset()
    _setKvForTesting(makeFakeKv())
  })
  afterEach(() => {
    process.env = originalEnv
    _setKvForTesting(null)
  })

  it('paid SnapChef session: ok, remembered, and a Pro cookie is set that the server accepts', async () => {
    retrieve.mockResolvedValue(paid())
    const res = await call()
    const body = await res.json()
    expect(body).toMatchObject({ ok: true, plan: 'lifetime', serverRecorded: true })
    const cookie = res.headers.get('set-cookie') || ''
    expect(cookie).toContain(`${PRO_COOKIE}=pro_`)
    expect(cookie.toLowerCase()).toContain('httponly')
    const token = cookie.match(new RegExp(`${PRO_COOKIE}=(pro_[A-Za-z0-9_-]+)`))![1]
    expect((await lookupToken(token)).state).toBe('active')
  })

  it('calling it twice gives the same cookie (refresh-safe)', async () => {
    retrieve.mockResolvedValue(paid())
    const a = (await call()).headers.get('set-cookie')
    const b = (await call()).headers.get('set-cookie')
    expect(a!.split(';')[0]).toBe(b!.split(';')[0])
  })

  it("another app's paid session is refused and sets no cookie", async () => {
    retrieve.mockResolvedValue(paid({ metadata: { app: 'disputeninja' } }))
    const res = await call()
    expect(res.status).toBe(402)
    expect(res.headers.get('set-cookie')).toBeNull()
  })

  it('storage down: still ok while the server check is off, 503 once it is on', async () => {
    retrieve.mockResolvedValue(paid())
    _setKvForTesting(null)
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.KV_REST_API_URL
    const off = await call()
    expect((await off.json()).serverRecorded).toBe(false)
    process.env.SERVER_PRO_ENFORCE = 'true'
    expect((await call()).status).toBe(503)
  })

  it('monthly: pay-through date comes from the subscription', async () => {
    const end = Math.floor(Date.now() / 1000) + 25 * 86400
    retrieve.mockResolvedValue(paid({ mode: 'subscription', payment_intent: null, subscription: { id: 'sub_v1', current_period_end: end } }))
    const res = await call()
    const token = (res.headers.get('set-cookie') || '').match(/sc_pro=(pro_[A-Za-z0-9_-]+)/)![1]
    expect(await lookupToken(token)).toMatchObject({ state: 'active', plan: 'monthly', paidThrough: end })
  })
})

describe('verify-session funnel counting', () => {
  it('counts verify_fail with the reason, and verify_ok on success', async () => {
    const { _setFunnelStoreForTesting } = await import('@/lib/funnel')
    const { makeFakeFunnelStore } = await import('../helpers/fake-funnel-store')
    const fs = makeFakeFunnelStore()
    _setFunnelStoreForTesting(fs)
    process.env.STRIPE_SECRET_KEY = 'sk_test_x'
    _setKvForTesting(makeFakeKv())
    retrieve.mockReset().mockResolvedValue({ ...paid(), payment_status: 'unpaid', status: 'expired' })
    const bad = await call()
    expect(bad.status).toBe(402)
    const failLine = JSON.parse(fs.lists.get('fnlog:snapchef')![0])
    expect(failLine.event).toBe('verify_fail')
    retrieve.mockReset().mockResolvedValue(paid())
    const ok = await call()
    expect(ok.status).toBe(200)
    expect(JSON.parse(fs.lists.get('fnlog:snapchef')![0]).event).toBe('verify_ok')
    _setFunnelStoreForTesting(undefined)
    _setKvForTesting(null)
  })
})

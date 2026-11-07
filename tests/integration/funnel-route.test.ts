import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const rl = vi.fn()
vi.mock('@/lib/rate-limit', async () => {
  const actual = await vi.importActual<typeof import('@/lib/rate-limit')>('@/lib/rate-limit')
  return { ...actual, rateLimit: (...a: unknown[]) => rl(...a) }
})

import { POST } from '@/app/api/funnel/route'
import { _setFunnelStoreForTesting } from '@/lib/funnel'
import { makeFakeFunnelStore } from '../helpers/fake-funnel-store'

const send = (body: unknown) =>
  POST(new NextRequest('http://localhost:3000/api/funnel', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) }))

describe('POST /api/funnel', () => {
  let store: ReturnType<typeof makeFakeFunnelStore>
  beforeEach(() => {
    rl.mockReset().mockResolvedValue({ success: true, limit: 60, remaining: 59, reset: 0 })
    store = makeFakeFunnelStore()
    _setFunnelStoreForTesting(store)
  })
  afterEach(() => _setFunnelStoreForTesting(undefined))

  it('204 for a browser event and it is counted', async () => {
    const res = await send({ event: 'checkout_click', surface: 'web', plan: 'monthly' })
    expect(res.status).toBe(204)
    expect(Object.values([...store.hashes.values()][0])).toEqual([1])
  })
  it('400 for server-only events (cannot be faked from a browser)', async () => {
    for (const event of ['verify_ok', 'verify_fail', 'checkout_created']) {
      expect((await send({ event, surface: 'web' })).status).toBe(400)
    }
    expect(store.hashes.size).toBe(0)
  })
  it('400 for unknown event, bad surface, bad plan, bad json, empty body', async () => {
    expect((await send({ event: 'nope', surface: 'web' })).status).toBe(400)
    expect((await send({ event: 'checkout_click', surface: 'tv' })).status).toBe(400)
    expect((await send({ event: 'checkout_click', surface: 'web', plan: 'gold' })).status).toBe(400)
    expect((await send('{not json')).status).toBe(400)
    expect((await send('')).status).toBe(400)
  })
  it('400 for a body over 512 bytes', async () => {
    expect((await send({ event: 'checkout_click', surface: 'web', reason: 'x'.repeat(600) })).status).toBe(400)
  })
  it('429 when rate limited', async () => {
    rl.mockResolvedValue({ success: false, limit: 60, remaining: 0, reset: 0 })
    expect((await send({ event: 'checkout_click', surface: 'web' })).status).toBe(429)
    expect(store.hashes.size).toBe(0)
  })
  it('still 204 when Redis is down', async () => {
    store.failing = true
    expect((await send({ event: 'checkout_click', surface: 'web' })).status).toBe(204)
  })
})

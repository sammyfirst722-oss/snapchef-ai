import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const create = vi.fn()
vi.mock('stripe', () => ({ default: class { checkout = { sessions: { create } } } }))

import { POST } from '@/app/api/stripe/checkout/route'
import { _setFunnelStoreForTesting } from '@/lib/funnel'
import { makeFakeFunnelStore } from '../helpers/fake-funnel-store'

const call = (body: object, headers: Record<string, string> = {}) =>
  POST(new NextRequest('http://localhost:3000/api/stripe/checkout', { method: 'POST', body: JSON.stringify(body), headers }))

describe('POST /api/stripe/checkout', () => {
  const env = process.env
  let store: ReturnType<typeof makeFakeFunnelStore>
  beforeEach(() => {
    process.env = { ...env, STRIPE_SECRET_KEY: 'sk_test_x' }
    delete process.env.NEXT_PUBLIC_SITE_URL
    create.mockReset().mockResolvedValue({ url: 'https://checkout.stripe.com/c/pay/cs_test_1' })
    store = makeFakeFunnelStore()
    _setFunnelStoreForTesting(store)
  })
  afterEach(() => {
    process.env = env
    _setFunnelStoreForTesting(undefined)
  })

  it('with no Origin the buyer comes back to the real site, not localhost', async () => {
    const res = await call({ plan: 'monthly' })
    expect(res.status).toBe(200)
    const args = create.mock.calls[0][0]
    expect(args.success_url).toBe('https://snapchef-ai-eight.vercel.app/?session_id={CHECKOUT_SESSION_ID}')
    expect(args.cancel_url).toBe('https://snapchef-ai-eight.vercel.app/?canceled=true')
    expect(args.metadata).toEqual({ plan: 'monthly', app: 'snapchef' })
  })
  it('a foreign Origin is ignored', async () => {
    await call({ plan: 'lifetime' }, { origin: 'https://evil.example' })
    expect(create.mock.calls[0][0].success_url.startsWith('https://snapchef-ai-eight.vercel.app/')).toBe(true)
  })
  it('records checkout_created once', async () => {
    await call({ plan: 'lifetime' })
    expect([...store.hashes.values()][0]).toEqual({ 'checkout_created|web|lifetime': 1 })
  })
  it('records checkout_error with the Stripe code when Stripe fails', async () => {
    create.mockRejectedValue(Object.assign(new Error('bad'), { code: 'api_key_expired' }))
    const res = await call({ plan: 'lifetime' })
    expect(res.status).toBe(500)
    expect(JSON.parse(store.lists.get('fnlog:snapchef')![0]).reason).toBe('api_key_expired')
  })
  it('Android app path returns before any Stripe call and counts nothing', async () => {
    const res = await call({ plan: 'monthly', isTwa: true })
    expect((await res.json()).usePlayBilling).toBe(true)
    expect(create).not.toHaveBeenCalled()
    expect(store.hashes.size).toBe(0)
  })
})

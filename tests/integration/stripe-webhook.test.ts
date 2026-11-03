import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Stripe from 'stripe'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/stripe/webhook/route'
import { _setKvForTesting, findToken, issueEntitlement, lookupToken } from '@/lib/entitlements'
import { makeFakeKv } from '../helpers/fake-kv'

const SECRET = 'whsec_test_secret_for_unit_tests'
const stripe = new Stripe('not-configured', { apiVersion: '2024-04-10' as any })

function signedRequest(event: object, opts: { secret?: string; omitSignature?: boolean } = {}) {
  const payload = JSON.stringify(event)
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret: opts.secret ?? SECRET })
  return new NextRequest('http://localhost:3000/api/stripe/webhook', {
    method: 'POST',
    headers: opts.omitSignature ? {} : { 'stripe-signature': header },
    body: payload,
  })
}

const evt = (type: string, object: object) => ({ id: 'evt_' + Math.random().toString(36).slice(2), object: 'event', type, data: { object } })
const nowS = () => Math.floor(Date.now() / 1000)

describe('POST /api/stripe/webhook', () => {
  const originalEnv = process.env
  let kv: ReturnType<typeof makeFakeKv>

  beforeEach(() => {
    process.env = { ...originalEnv, STRIPE_WEBHOOK_SECRET: SECRET }
    delete process.env.STRIPE_SECRET_KEY
    kv = makeFakeKv()
    _setKvForTesting(kv)
  })
  afterEach(() => {
    process.env = originalEnv
    _setKvForTesting(null)
  })

  it('is off (503) until the webhook secret is set', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET
    expect((await POST(signedRequest(evt('x', {})))).status).toBe(503)
  })

  it('rejects a missing signature and a wrong signature (400)', async () => {
    expect((await POST(signedRequest(evt('x', {}), { omitSignature: true }))).status).toBe(400)
    expect((await POST(signedRequest(evt('x', {}), { secret: 'whsec_wrong' }))).status).toBe(400)
  })

  it('answers 200 to another app\'s events and unknown event types', async () => {
    const other = await POST(signedRequest(evt('checkout.session.completed', { id: 'cs_test_other', metadata: { app: 'disputeninja' }, status: 'complete', payment_status: 'paid', mode: 'payment', created: nowS() })))
    expect(other.status).toBe(200)
    expect((await other.json()).ignored).toBe(true)
    expect((await POST(signedRequest(evt('customer.created', {})))).status).toBe(200)
    expect((await POST(signedRequest(evt('customer.subscription.deleted', { id: 'sub_not_ours' })))).status).toBe(200)
  })

  it('records a paid SnapChef checkout even if the buyer closed the tab', async () => {
    const res = await POST(signedRequest(evt('checkout.session.completed', {
      id: 'cs_test_a1', metadata: { app: 'snapchef' }, status: 'complete', payment_status: 'paid', mode: 'payment', created: nowS(), payment_intent: 'pi_a1',
    })))
    expect(res.status).toBe(200)
    expect(await findToken('cs', 'cs_test_a1')).not.toBeNull()
    expect(await findToken('pi', 'pi_a1')).toBe(await findToken('cs', 'cs_test_a1'))
  })

  it('full refund of a lifetime purchase turns Pro off; partial refund does not', async () => {
    const issued = (await issueEntitlement({ source: 'stripe', plan: 'lifetime', paidThrough: null, index: { cs: 'cs_test_b', pi: 'pi_b' } })) as any
    const partial = await POST(signedRequest(evt('charge.refunded', { refunded: false, payment_intent: 'pi_b' })))
    expect((await partial.json()).ignored).toBe(true)
    expect((await lookupToken(issued.token)).state).toBe('active')

    const full = await POST(signedRequest(evt('charge.refunded', { refunded: true, payment_intent: 'pi_b' })))
    expect(full.status).toBe(200)
    expect((await lookupToken(issued.token)).state).toBe('none')
  })

  it('dispute turns Pro off', async () => {
    const issued = (await issueEntitlement({ source: 'stripe', plan: 'lifetime', paidThrough: null, index: { cs: 'cs_test_c', pi: 'pi_c' } })) as any
    await POST(signedRequest(evt('charge.dispute.created', { payment_intent: 'pi_c', charge: 'ch_c' })))
    expect((await lookupToken(issued.token)).state).toBe('none')
  })

  it('subscription: renewal extends, cancel-at-period-end keeps Pro, deleted turns it off', async () => {
    const issued = (await issueEntitlement({ source: 'stripe', plan: 'monthly', paidThrough: nowS() + 100, index: { cs: 'cs_test_d', sub: 'sub_d' } })) as any
    const future = nowS() + 20 * 24 * 3600
    await POST(signedRequest(evt('customer.subscription.updated', { id: 'sub_d', status: 'active', cancel_at_period_end: true, current_period_end: future })))
    expect(await lookupToken(issued.token)).toMatchObject({ state: 'active', paidThrough: future })
    await POST(signedRequest(evt('customer.subscription.deleted', { id: 'sub_d' })))
    expect((await lookupToken(issued.token)).state).toBe('none')
  })

  it('renewal extends Pro when the period end is on the subscription item (newer Stripe API)', async () => {
    const issued = (await issueEntitlement({ source: 'stripe', plan: 'monthly', paidThrough: nowS() + 100, index: { cs: 'cs_test_g', sub: 'sub_g' } })) as any
    const future = nowS() + 25 * 24 * 3600
    await POST(signedRequest(evt('customer.subscription.updated', { id: 'sub_g', status: 'active', items: { data: [{ current_period_end: future }] } })))
    expect(await lookupToken(issued.token)).toMatchObject({ state: 'active', paidThrough: future })
  })

  it('subscription going unpaid turns Pro off at once', async () => {
    const issued = (await issueEntitlement({ source: 'stripe', plan: 'monthly', paidThrough: nowS() + 100, index: { sub: 'sub_e' } })) as any
    await POST(signedRequest(evt('customer.subscription.updated', { id: 'sub_e', status: 'unpaid', current_period_end: nowS() })))
    expect((await lookupToken(issued.token)).state).toBe('none')
  })

  it('returns 500 (so Stripe retries) when our own storage fails during a revoke', async () => {
    await issueEntitlement({ source: 'stripe', plan: 'lifetime', paidThrough: null, index: { cs: 'cs_test_f', pi: 'pi_f' } })
    kv.failing = true
    const res = await POST(signedRequest(evt('charge.refunded', { refunded: true, payment_intent: 'pi_f' })))
    expect(res.status).toBe(500)
  })
})

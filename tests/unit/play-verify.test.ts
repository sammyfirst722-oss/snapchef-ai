import { describe, it, expect, beforeAll, vi } from 'vitest'
import { generateKeyPairSync } from 'node:crypto'
import { verifyPlayPurchase } from '@/lib/play-verify'

const TOKEN = 'abcdefghijklmnopqrstuvwxyz0123456789'
let calls: { url: string; method: string }[] = []

beforeAll(() => {
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    publicKeyEncoding: { type: 'spki', format: 'pem' },
  })
  process.env.PLAY_SERVICE_ACCOUNT_JSON = JSON.stringify({
    client_email: 'test@example.iam.gserviceaccount.com',
    private_key: privateKey,
    token_uri: 'https://oauth.test/token',
  })
})

function fakeFetch(body: object, opts: { status?: number; ackOk?: boolean } = {}) {
  calls = []
  return (async (url: any, init?: any) => {
    const u = String(url)
    calls.push({ url: u, method: init?.method || 'GET' })
    if (u === 'https://oauth.test/token') return new Response(JSON.stringify({ access_token: 'tok', expires_in: 3600 }), { status: 200 })
    if (u.endsWith(':acknowledge')) return opts.ackOk === false ? new Response('{}', { status: 500 }) : new Response(null, { status: 204 })
    return new Response(JSON.stringify(body), { status: opts.status ?? 200 })
  }) as unknown as typeof fetch
}

const inFuture = () => new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString()

describe('lifetime pass (one-time product)', () => {
  it('accepts a real purchase and acknowledges it', async () => {
    const r = await verifyPlayPurchase('snapchef_pro_lifetime', TOKEN, { acknowledge: true, fetchImpl: fakeFetch({ purchaseState: 0, acknowledgementState: 0 }) })
    expect(r).toMatchObject({ ok: true, plan: 'lifetime' })
    expect(calls.some((c) => c.url.includes('/products/snapchef_pro_lifetime/') && c.url.endsWith(':acknowledge'))).toBe(true)
  })
  it('rejects canceled or pending purchases', async () => {
    for (const purchaseState of [1, 2]) {
      expect(await verifyPlayPurchase('snapchef_pro_lifetime', TOKEN, { fetchImpl: fakeFetch({ purchaseState }) })).toMatchObject({ ok: false, reason: 'purchase_not_completed' })
    }
  })
})

describe('monthly plan (subscription)', () => {
  it('accepts an active subscription and acknowledges it', async () => {
    const body = { subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE', acknowledgementState: 'ACKNOWLEDGEMENT_STATE_PENDING', lineItems: [{ productId: 'snapchef_pro_monthly', expiryTime: inFuture() }] }
    const r = await verifyPlayPurchase('snapchef_pro_monthly', TOKEN, { acknowledge: true, fetchImpl: fakeFetch(body) })
    expect(r).toMatchObject({ ok: true, plan: 'monthly' })
    expect(r.ok && r.expiresAt).toBeTruthy()
    expect(calls.some((c) => c.url.includes('/subscriptions/snapchef_pro_monthly/') && c.url.endsWith(':acknowledge'))).toBe(true)
  })
  it('keeps access for a canceled plan until the paid period ends', async () => {
    const body = { subscriptionState: 'SUBSCRIPTION_STATE_CANCELED', acknowledgementState: 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED', lineItems: [{ productId: 'snapchef_pro_monthly', expiryTime: inFuture() }] }
    expect(await verifyPlayPurchase('snapchef_pro_monthly', TOKEN, { fetchImpl: fakeFetch(body) })).toMatchObject({ ok: true })
  })
  it('rejects expired, on-hold or wrong-product subscriptions', async () => {
    const past = new Date(Date.now() - 1000).toISOString()
    expect(await verifyPlayPurchase('snapchef_pro_monthly', TOKEN, { fetchImpl: fakeFetch({ subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE', lineItems: [{ productId: 'snapchef_pro_monthly', expiryTime: past }] }) })).toMatchObject({ ok: false, reason: 'purchase_not_active' })
    expect(await verifyPlayPurchase('snapchef_pro_monthly', TOKEN, { fetchImpl: fakeFetch({ subscriptionState: 'SUBSCRIPTION_STATE_ON_HOLD', lineItems: [{ productId: 'snapchef_pro_monthly', expiryTime: inFuture() }] }) })).toMatchObject({ ok: false })
    expect(await verifyPlayPurchase('snapchef_pro_monthly', TOKEN, { fetchImpl: fakeFetch({ subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE', lineItems: [{ productId: 'other_sku', expiryTime: inFuture() }] }) })).toMatchObject({ ok: false })
  })
})

describe('safety', () => {
  it('rejects tokens Google does not know', async () => {
    expect(await verifyPlayPurchase('snapchef_pro_lifetime', 'snapchef_play_token_1730000000000', { fetchImpl: fakeFetch({}, { status: 404 }) })).toMatchObject({ ok: false, status: 402, reason: 'purchase_not_found' })
  })
  it('reports a permission problem as 503, never as success', async () => {
    expect(await verifyPlayPurchase('snapchef_pro_lifetime', TOKEN, { fetchImpl: fakeFetch({}, { status: 403 }) })).toMatchObject({ ok: false, status: 503, reason: 'play_api_permission' })
  })
  it('fails when acknowledging fails, so the app retries', async () => {
    expect(await verifyPlayPurchase('snapchef_pro_lifetime', TOKEN, { acknowledge: true, fetchImpl: fakeFetch({ purchaseState: 0, acknowledgementState: 0 }, { ackOk: false }) })).toMatchObject({ ok: false, status: 502 })
  })
  it('rejects unknown products and malformed tokens before calling Google', async () => {
    const f = fakeFetch({ purchaseState: 0 })
    expect(await verifyPlayPurchase('snapchef_pro_free', TOKEN, { fetchImpl: f })).toMatchObject({ ok: false, reason: 'unknown_product' })
    expect(await verifyPlayPurchase('snapchef_pro_lifetime', 'short', { fetchImpl: f })).toMatchObject({ ok: false, reason: 'invalid_purchase_token' })
    expect(await verifyPlayPurchase('snapchef_pro_lifetime', undefined, { fetchImpl: f })).toMatchObject({ ok: false })
    expect(calls.length).toBe(0)
  })
  it('fails closed (503) when the Google key is not configured', async () => {
    const saved = process.env.PLAY_SERVICE_ACCOUNT_JSON
    vi.resetModules() // fresh copy of the module, so no cached Google token is reused
    delete process.env.PLAY_SERVICE_ACCOUNT_JSON
    try {
      const fresh = await import('@/lib/play-verify')
      const r = await fresh.verifyPlayPurchase('snapchef_pro_lifetime', TOKEN, { fetchImpl: fakeFetch({ purchaseState: 0, acknowledgementState: 1 }) })
      expect(r).toMatchObject({ ok: false, status: 503, reason: 'play_verification_not_configured' })
      expect(calls.length).toBe(0) // never even asked Google
    } finally {
      process.env.PLAY_SERVICE_ACCOUNT_JSON = saved
    }
  })
})

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  _setKvForTesting,
  findToken,
  hashPlayToken,
  isProLookup,
  isRecordActive,
  isWellFormedToken,
  issueEntitlement,
  lookupToken,
  MONTHLY_GRACE_SECONDS,
  newToken,
  revokeToken,
  setPaidThrough,
} from '@/lib/entitlements'
import { makeFakeKv } from '../helpers/fake-kv'

const NOW = 1_800_000_000

describe('entitlements: pure helpers', () => {
  it('makes unguessable well-formed tokens', () => {
    const a = newToken()
    const b = newToken()
    expect(isWellFormedToken(a)).toBe(true)
    expect(a).not.toBe(b)
    expect(isWellFormedToken('pro_short')).toBe(false)
    expect(isWellFormedToken('x'.repeat(47))).toBe(false)
    expect(isWellFormedToken(undefined)).toBe(false)
  })

  it('lifetime is active until revoked; monthly gets a small grace after paidThrough', () => {
    const base = { source: 'stripe' as const, createdAt: NOW, status: 'active' as const }
    expect(isRecordActive({ ...base, plan: 'lifetime', paidThrough: null }, NOW)).toBe(true)
    expect(isRecordActive({ ...base, plan: 'monthly', paidThrough: NOW + 100 }, NOW)).toBe(true)
    expect(isRecordActive({ ...base, plan: 'monthly', paidThrough: NOW - 10 }, NOW)).toBe(true) // inside grace
    expect(isRecordActive({ ...base, plan: 'monthly', paidThrough: NOW - MONTHLY_GRACE_SECONDS - 10 }, NOW)).toBe(false)
    expect(isRecordActive({ ...base, plan: 'lifetime', paidThrough: null, status: 'revoked' }, NOW)).toBe(false)
    expect(isRecordActive(null, NOW)).toBe(false)
  })

  it('hashes the Play purchase token (the raw token is never stored)', () => {
    const h = hashPlayToken('some-purchase-token-value-123')
    expect(h).toMatch(/^[0-9a-f]{64}$/)
    expect(h).not.toContain('purchase')
  })
})

describe('entitlements: storage', () => {
  let kv: ReturnType<typeof makeFakeKv>
  beforeEach(() => {
    kv = makeFakeKv()
    _setKvForTesting(kv)
  })
  afterEach(() => _setKvForTesting(null))

  it('issues once per purchase and returns the same token on repeat (page refresh)', async () => {
    const a = await issueEntitlement({ source: 'stripe', plan: 'lifetime', paidThrough: null, index: { cs: 'cs_test_1', pi: 'pi_1' } })
    const b = await issueEntitlement({ source: 'stripe', plan: 'lifetime', paidThrough: null, index: { cs: 'cs_test_1', pi: 'pi_1' } })
    expect(a && 'token' in a && a.created).toBe(true)
    expect(b && 'token' in b && b.created).toBe(false)
    expect((a as any).token).toBe((b as any).token)
  })

  it('browser and webhook racing for the same purchase end up with ONE token', async () => {
    const [a, b] = await Promise.all([
      issueEntitlement({ source: 'stripe', plan: 'monthly', paidThrough: NOW, index: { cs: 'cs_test_2', sub: 'sub_2' } }),
      issueEntitlement({ source: 'stripe', plan: 'monthly', paidThrough: NOW, index: { cs: 'cs_test_2', sub: 'sub_2' } }),
    ])
    expect((a as any).token).toBe((b as any).token)
    expect(await findToken('sub', 'sub_2')).toBe((a as any).token)
  })

  it('lookup: active for a paid token, none for unknown or malformed', async () => {
    const t = (await issueEntitlement({ source: 'play', plan: 'lifetime', paidThrough: null, index: { play: 'abc' } })) as any
    const ok = await lookupToken(t.token, NOW)
    expect(ok).toMatchObject({ state: 'active', plan: 'lifetime' })
    expect(isProLookup(ok)).toBe(true)
    expect((await lookupToken(newToken(), NOW)).state).toBe('none')
    expect((await lookupToken('garbage', NOW)).state).toBe('none')
    expect((await lookupToken(undefined, NOW)).state).toBe('none')
  })

  it('revoke turns Pro off and a refunded purchase cannot be re-issued', async () => {
    const t = (await issueEntitlement({ source: 'stripe', plan: 'lifetime', paidThrough: null, index: { cs: 'cs_test_3', pi: 'pi_3' } })) as any
    const found = await findToken('pi', 'pi_3')
    expect(found).toBe(t.token)
    await revokeToken(found!, 'refunded')
    expect((await lookupToken(t.token, NOW)).state).toBe('none')
    const again = await issueEntitlement({ source: 'stripe', plan: 'lifetime', paidThrough: null, index: { cs: 'cs_test_3', pi: 'pi_3' } })
    expect(again).toEqual({ revoked: true })
  })

  it('renewal moves paidThrough forward; it never un-revokes', async () => {
    const t = (await issueEntitlement({ source: 'stripe', plan: 'monthly', paidThrough: NOW + 10, index: { sub: 'sub_4' } })) as any
    await setPaidThrough(t.token, NOW + 99999)
    expect(await lookupToken(t.token, NOW + 50000)).toMatchObject({ state: 'active', paidThrough: NOW + 99999 })
    await revokeToken(t.token, 'subscription_deleted')
    await setPaidThrough(t.token, NOW + 999999)
    expect((await lookupToken(t.token, NOW)).state).toBe('none')
  })

  it('does NOT count as Pro when Redis is down (cannot verify), and garbage is none', async () => {
    const t = (await issueEntitlement({ source: 'stripe', plan: 'lifetime', paidThrough: null, index: { cs: 'cs_test_5' } })) as any
    kv.failing = true
    const l = await lookupToken(t.token, NOW)
    expect(l.state).toBe('unverified')
    expect(isProLookup(l)).toBe(false)
    expect((await lookupToken('garbage', NOW)).state).toBe('none')
  })

  it('fails CLOSED when creating a new entitlement while Redis is down', async () => {
    kv.failing = true
    expect(await issueEntitlement({ source: 'stripe', plan: 'lifetime', paidThrough: null, index: { cs: 'cs_test_6' } })).toBeNull()
  })

  it('without Redis at all there is nothing to verify against: no Pro', async () => {
    _setKvForTesting(null)
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.KV_REST_API_URL
    expect((await lookupToken(newToken(), NOW)).state).toBe('none')
  })
})

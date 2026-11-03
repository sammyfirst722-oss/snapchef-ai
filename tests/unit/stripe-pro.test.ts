import { describe, it, expect } from 'vitest'
import { checkProSession } from '@/lib/stripe-pro'

const NOW = 1_800_000_000
const good = {
  id: 'cs_test_abcdefghij1234',
  mode: 'payment',
  status: 'complete',
  payment_status: 'paid',
  created: NOW - 60,
  metadata: { app: 'snapchef', plan: 'lifetime' },
}

describe('checkProSession (server proof that SnapChef Pro was really bought)', () => {
  it('accepts a paid lifetime session for this app', () => {
    expect(checkProSession(good, NOW)).toEqual({ ok: true, plan: 'lifetime' })
  })

  it('accepts a completed, paid subscription session for this app', () => {
    expect(checkProSession({ ...good, mode: 'subscription' }, NOW)).toEqual({ ok: true, plan: 'monthly' })
  })

  it('rejects a missing session', () => {
    expect(checkProSession(null, NOW)).toEqual({ ok: false, reason: 'session_not_found' })
  })

  it('rejects an unpaid session', () => {
    expect(checkProSession({ ...good, payment_status: 'unpaid', status: 'open' }, NOW).ok).toBe(false)
    expect(checkProSession({ ...good, payment_status: 'unpaid' }, NOW)).toEqual({ ok: false, reason: 'not_paid' })
  })

  it('rejects a paid session that belongs to a different app (shared Stripe account)', () => {
    expect(checkProSession({ ...good, metadata: { productType: 'letter' } }, NOW)).toEqual({ ok: false, reason: 'wrong_app' })
    expect(checkProSession({ ...good, metadata: { app: 'plainnews' } }, NOW)).toEqual({ ok: false, reason: 'wrong_app' })
    expect(checkProSession({ ...good, metadata: null }, NOW)).toEqual({ ok: false, reason: 'wrong_app' })
  })

  it('rejects an old session', () => {
    expect(checkProSession({ ...good, created: NOW - 25 * 60 * 60 }, NOW)).toEqual({ ok: false, reason: 'session_expired' })
  })

  it('rejects an unsupported mode', () => {
    expect(checkProSession({ ...good, mode: 'setup' }, NOW)).toEqual({ ok: false, reason: 'unsupported_mode' })
  })
})

// Decides whether a Stripe Checkout Session is real proof that THIS app's Pro was bought.
// Pure function (no network) so it can be unit-tested with fake sessions.
//
// All of Sammy's apps share one Stripe account, so a paid session from another app (for example a
// DisputeNinja letter) must NOT unlock SnapChef Pro. That is what the metadata.app check is for.

export const PRO_APP_ID = 'snapchef'
export const MAX_SESSION_AGE_SECONDS = 24 * 60 * 60

export interface ProSessionLike {
  id?: string
  mode?: string | null
  status?: string | null
  payment_status?: string | null
  created?: number
  metadata?: Record<string, string> | null
}

export type ProCheck = { ok: true; plan: 'monthly' | 'lifetime' } | { ok: false; reason: string }

export function checkProSession(s: ProSessionLike | null | undefined, nowSeconds: number): ProCheck {
  if (!s) return { ok: false, reason: 'session_not_found' }
  if (s.metadata?.app !== PRO_APP_ID) return { ok: false, reason: 'wrong_app' }
  if (s.status !== 'complete') return { ok: false, reason: 'not_complete' }
  if (s.payment_status !== 'paid') return { ok: false, reason: 'not_paid' }
  if (s.mode !== 'payment' && s.mode !== 'subscription') return { ok: false, reason: 'unsupported_mode' }
  if (typeof s.created !== 'number' || nowSeconds - s.created > MAX_SESSION_AGE_SECONDS) {
    return { ok: false, reason: 'session_expired' }
  }
  return { ok: true, plan: s.mode === 'subscription' ? 'monthly' : 'lifetime' }
}

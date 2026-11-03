import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkProSession } from '@/lib/stripe-pro'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { cookieOptions, enforcementEnabled, issueEntitlement, PRO_COOKIE, type IndexKind } from '@/lib/entitlements'

const idOf = (v: unknown): string | undefined =>
  typeof v === 'string' ? v : v && typeof (v as { id?: unknown }).id === 'string' ? (v as { id: string }).id : undefined

// The browser calls this after returning from Stripe Checkout. Pro is only switched on when
// Stripe itself says this app's session is paid. A made-up or foreign session id is refused.
// When Stripe confirms, the server also remembers the purchase and sets a Pro cookie (see lib/entitlements.ts).
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const limited = await rateLimit(`verify-session:${ip}`, 20, 60 * 60)
  if (!limited.success) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  const { sessionId } = await req.json().catch(() => ({} as { sessionId?: unknown }))
  if (typeof sessionId !== 'string' || !/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    return NextResponse.json({ ok: false, reason: 'bad_session_id' }, { status: 400 })
  }

  const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim().replace(/[\r\n"']/g, '')
  if (!stripeKey) {
    return NextResponse.json({ ok: false, reason: 'payments_not_configured' }, { status: 503 })
  }

  let session: any
  try {
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' as any })
    session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['subscription'] })
  } catch {
    return NextResponse.json({ ok: false, reason: 'session_not_found' }, { status: 402 })
  }

  const result = checkProSession(session, Math.floor(Date.now() / 1000))
  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 402 })
  }

  // Remember the purchase on the server and hand the browser a Pro cookie.
  const index: Partial<Record<IndexKind, string>> = { cs: session.id }
  const pi = idOf(session.payment_intent)
  const sub = idOf(session.subscription)
  if (pi) index.pi = pi
  if (sub) index.sub = sub
  const periodEnd = typeof session.subscription?.current_period_end === 'number' ? session.subscription.current_period_end : null
  const issued = await issueEntitlement({
    source: 'stripe',
    plan: result.plan,
    paidThrough: result.plan === 'monthly' ? periodEnd : null,
    index,
  })

  if (issued && 'revoked' in issued) {
    return NextResponse.json({ ok: false, reason: 'purchase_refunded' }, { status: 402 })
  }
  if (!issued) {
    // Could not save the purchase. While the server check is off this changes nothing for the buyer (as before);
    // once it is on, Pro would not stick, so tell the browser to try again rather than pretend.
    if (enforcementEnabled()) {
      return NextResponse.json({ ok: false, reason: 'pro_storage_unavailable' }, { status: 503 })
    }
    return NextResponse.json({ ok: true, plan: result.plan, serverRecorded: false })
  }

  const res = NextResponse.json({ ok: true, plan: result.plan, serverRecorded: true })
  res.cookies.set(PRO_COOKIE, issued.token, cookieOptions)
  return res
}

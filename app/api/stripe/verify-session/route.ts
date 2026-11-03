import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkProSession } from '@/lib/stripe-pro'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// The browser calls this after returning from Stripe Checkout. Pro is only switched on when
// Stripe itself says this app's session is paid. A made-up or foreign session id is refused.
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

  try {
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' as any })
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const result = checkProSession(session as any, Math.floor(Date.now() / 1000))
    if (!result.ok) {
      return NextResponse.json({ ok: false, reason: result.reason }, { status: 402 })
    }
    return NextResponse.json({ ok: true, plan: result.plan })
  } catch {
    return NextResponse.json({ ok: false, reason: 'session_not_found' }, { status: 402 })
  }
}

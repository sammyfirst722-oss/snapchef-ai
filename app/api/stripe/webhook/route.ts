import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkProSession, PRO_APP_ID } from '@/lib/stripe-pro'
import { findToken, issueEntitlement, revokeToken, setPaidThrough, type IndexKind } from '@/lib/entitlements'

// Stripe tells us here when a SnapChef Pro purchase is cancelled, refunded or disputed.
//
// One Stripe account serves every app, so this address also receives other apps' events.
// Rule: an event we do not recognise as ours gets a plain 200 (otherwise Stripe retries for days and then
// switches the address off). A real failure on OUR data (Redis down) gets a 500 so Stripe retries it.
//
// Stripe sends the body as raw text and signs those exact bytes, so we must read it with req.text(), not req.json().

const idOf = (v: unknown): string | undefined =>
  typeof v === 'string' ? v : v && typeof (v as { id?: unknown }).id === 'string' ? (v as { id: string }).id : undefined

const ok = (extra: Record<string, unknown> = {}) => NextResponse.json({ received: true, ...extra })

async function revokeFirst(pairs: Array<[IndexKind, string | undefined]>, reason: string): Promise<boolean> {
  for (const [kind, id] of pairs) {
    if (!id) continue
    const token = await findToken(kind, id)
    if (token) {
      await revokeToken(token, reason)
      return true
    }
  }
  return false
}

export async function POST(req: NextRequest) {
  const secret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim()
  if (!secret) {
    return NextResponse.json({ error: 'webhook_not_configured' }, { status: 503 })
  }
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 400 })
  }

  const raw = await req.text()
  const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim().replace(/[\r\n"']/g, '')
  const stripe = new Stripe(stripeKey || 'not-configured', { apiVersion: '2024-04-10' as any })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret)
  } catch {
    return NextResponse.json({ error: 'bad_signature' }, { status: 400 })
  }

  try {
    const obj: any = event.data.object

    switch (event.type) {
      case 'checkout.session.completed': {
        // Covers a buyer who closes the tab before the browser check runs: the purchase is still recorded.
        if (obj?.metadata?.app !== PRO_APP_ID) return ok({ ignored: true })
        const check = checkProSession(obj, Math.floor(Date.now() / 1000))
        // checkProSession rejects sessions older than 24h; a webhook is always fresh, but stay strict.
        if (!check.ok) return ok({ ignored: true, reason: check.reason })
        const index: Partial<Record<IndexKind, string>> = { cs: obj.id }
        const pi = idOf(obj.payment_intent)
        const sub = idOf(obj.subscription)
        if (pi) index.pi = pi
        if (sub) index.sub = sub
        const issued = await issueEntitlement({
          source: 'stripe',
          plan: check.plan,
          // The real renewal date arrives with customer.subscription.updated; give the first month meanwhile.
          paidThrough: check.plan === 'monthly' ? Math.floor(Date.now() / 1000) + 31 * 24 * 60 * 60 : null,
          index,
        })
        if (!issued) return NextResponse.json({ error: 'storage_unavailable' }, { status: 500 })
        return ok({ recorded: true })
      }

      case 'customer.subscription.updated': {
        const subId = obj?.id as string | undefined
        const token = subId ? await findToken('sub', subId) : null
        if (!token) return ok({ ignored: true }) // another app's subscription (or one we never issued)
        const status = obj.status as string
        if (status === 'canceled' || status === 'unpaid' || status === 'incomplete_expired') {
          await revokeToken(token, `subscription_${status}`)
          return ok({ revoked: true })
        }
        // active / trialing / past_due: paid through the end of the current period (cancel_at_period_end keeps it too)
        if (typeof obj.current_period_end === 'number') await setPaidThrough(token, obj.current_period_end)
        return ok({ updated: true })
      }

      case 'customer.subscription.deleted': {
        const subId = obj?.id as string | undefined
        const token = subId ? await findToken('sub', subId) : null
        if (!token) return ok({ ignored: true })
        await revokeToken(token, 'subscription_deleted')
        return ok({ revoked: true })
      }

      case 'charge.refunded': {
        // Only a full refund switches Pro off; a small partial refund (goodwill) does not.
        if (obj?.refunded !== true) return ok({ ignored: true, reason: 'partial_refund' })
        let done = await revokeFirst([['pi', idOf(obj.payment_intent)]], 'refunded')
        if (!done && typeof obj.invoice === 'string' && stripeKey) {
          // A subscription payment: the charge points to an invoice, and the invoice points to the subscription.
          const invoice: any = await stripe.invoices.retrieve(obj.invoice)
          done = await revokeFirst([['sub', idOf(invoice.subscription)]], 'refunded')
        }
        return ok({ revoked: done })
      }

      case 'charge.dispute.created': {
        let done = await revokeFirst([['pi', idOf(obj.payment_intent)]], 'disputed')
        if (!done && stripeKey && typeof obj.charge === 'string') {
          const charge: any = await stripe.charges.retrieve(obj.charge)
          done = await revokeFirst([['pi', idOf(charge.payment_intent)]], 'disputed')
          if (!done && typeof charge.invoice === 'string') {
            const invoice: any = await stripe.invoices.retrieve(charge.invoice)
            done = await revokeFirst([['sub', idOf(invoice.subscription)]], 'disputed')
          }
        }
        return ok({ revoked: done })
      }

      default:
        return ok({ ignored: true })
    }
  } catch (err) {
    console.error('[stripe webhook] failed to process', event.type, err)
    return NextResponse.json({ error: 'processing_failed' }, { status: 500 })
  }
}

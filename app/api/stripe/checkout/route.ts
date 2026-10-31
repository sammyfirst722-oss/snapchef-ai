import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function isAndroidTwa(req: NextRequest, bodyIsTwa?: boolean): boolean {
  if (bodyIsTwa) return true
  const xRequestedWith = (req.headers.get('x-requested-with') || '').toLowerCase()
  if (xRequestedWith.includes('snapchef') || xRequestedWith.includes('twa')) return true
  const referer = (req.headers.get('referer') || '').toLowerCase()
  if (referer.includes('android-app://')) return true
  return false
}

export async function POST(req: NextRequest) {
  try {
    const { plan = 'lifetime', isTwa = false } = await req.json().catch(() => ({}))

    // Google Play Policy Compliance: Provide Play Billing guidance for Android TWA
    if (isAndroidTwa(req, isTwa)) {
      return NextResponse.json(
        {
          usePlayBilling: true,
          message: 'In-app digital purchases on Android use Google Play Store billing.',
          isAndroidApp: true,
        },
        { status: 200 }
      )
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!stripeKey) {
      return NextResponse.json(
        { error: 'Stripe checkout is not configured yet.' },
        { status: 503 }
      )
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-04-10' as any,
    })

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const lineItems =
      plan === 'monthly'
        ? [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'SnapChef Pro Monthly Pass',
                  description:
                    'Unlimited AI camera fridge scans, recipe generator, and meal planner.',
                },
                unit_amount: 499, // $4.99/mo
                recurring: {
                  interval: 'month' as const,
                },
              },
              quantity: 1,
            },
          ]
        : [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'SnapChef Pro Lifetime Pass',
                  description:
                    'One-time payment for lifetime unlimited AI fridge camera scans and custom recipes.',
                },
                unit_amount: 1999, // $19.99
              },
              quantity: 1,
            },
          ]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: plan === 'monthly' ? 'subscription' : 'payment',
      success_url: `${origin}/?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        plan,
      },
    })

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: err.message || 'Unable to start checkout session' },
      { status: 500 }
    )
  }
}

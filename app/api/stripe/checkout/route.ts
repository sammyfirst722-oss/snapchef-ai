import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const { plan = 'lifetime' } = await req.json()
    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!stripeKey) {
      // In demo mode or if keys are not yet pasted, return fallback so client unlocks Pro
      return NextResponse.json({
        demo: true,
        message: 'Stripe keys not set in .env.local yet. Activated demo Pro mode.',
      })
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
                  name: 'SnapChef AI Pro (Monthly)',
                  description: 'Unlimited AI Fridge Camera Scans & Custom Recipes',
                },
                unit_amount: 499, // $4.99
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
                  name: 'SnapChef AI Pro (Lifetime Pass)',
                  description: 'Pay once, own SnapChef Pro forever with unlimited AI scans',
                },
                unit_amount: 1999, // $19.99
              },
              quantity: 1,
            },
          ]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: plan === 'monthly' ? 'subscription' : 'payment',
      line_items: lineItems,
      success_url: `${origin}/?upgraded=true`,
      cancel_url: `${origin}/?canceled=true`,
    })

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { verifyPlayPurchase } from '@/lib/play-verify'

// Checks a Google Play purchase with Google itself, then acknowledges it.
// (Before 2026-11-02 this route said "verified" for any token.)
export async function POST(req: NextRequest) {
  try {
    const { sku, purchaseToken } = await req.json().catch(() => ({}))
    const result = await verifyPlayPurchase(sku, purchaseToken, { acknowledge: true })
    if (!result.ok) {
      return NextResponse.json({ verified: false, message: result.reason }, { status: result.status })
    }
    return NextResponse.json({ verified: true, plan: result.plan, expiresAt: result.expiresAt ?? null, status: 'acknowledged' })
  } catch (err) {
    console.error('[SnapChef Play Billing] Verify error:', err)
    return NextResponse.json({ verified: false, message: 'verification_failed' }, { status: 500 })
  }
}

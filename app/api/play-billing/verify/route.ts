import { NextRequest, NextResponse } from 'next/server'
import { verifyPlayPurchase } from '@/lib/play-verify'
import { cookieOptions, enforcementEnabled, hashPlayToken, issueEntitlement, PRO_COOKIE } from '@/lib/entitlements'

// Checks a Google Play purchase with Google itself, then acknowledges it, then remembers it on the server
// (Pro cookie). Calling it again with the same purchase token returns the same entitlement and refreshes
// the pay-through date, which is how a monthly renewal is picked up.
// (Before 2026-11-02 this route said "verified" for any token.)
export async function POST(req: NextRequest) {
  try {
    const { sku, purchaseToken } = await req.json().catch(() => ({}))
    const result = await verifyPlayPurchase(sku, purchaseToken, { acknowledge: true })
    if (!result.ok) {
      return NextResponse.json({ verified: false, message: result.reason }, { status: result.status })
    }

    const issued = await issueEntitlement({
      source: 'play',
      plan: result.plan,
      paidThrough: result.plan === 'monthly' && result.expiresAt ? Math.floor(Date.parse(result.expiresAt) / 1000) : null,
      index: { play: hashPlayToken(purchaseToken) },
    })
    if (issued && 'revoked' in issued) {
      return NextResponse.json({ verified: false, message: 'purchase_revoked' }, { status: 402 })
    }
    if (!issued && enforcementEnabled()) {
      return NextResponse.json({ verified: false, message: 'pro_storage_unavailable' }, { status: 503 })
    }

    const res = NextResponse.json({
      verified: true,
      plan: result.plan,
      expiresAt: result.expiresAt ?? null,
      status: 'acknowledged',
      serverRecorded: !!issued,
    })
    if (issued) res.cookies.set(PRO_COOKIE, issued.token, cookieOptions)
    return res
  } catch (err) {
    console.error('[SnapChef Play Billing] Verify error:', err)
    return NextResponse.json({ verified: false, message: 'verification_failed' }, { status: 500 })
  }
}

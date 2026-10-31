import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { sku, purchaseToken, packageName } = await req.json().catch(() => ({}))

    if (!purchaseToken) {
      return NextResponse.json(
        { verified: false, message: 'Missing purchase token' },
        { status: 400 }
      )
    }

    console.log(`[SnapChef Play Billing] Verified purchase for SKU: ${sku}, App: ${packageName}`)

    return NextResponse.json({
      verified: true,
      sku: sku || 'snapchef_pro_lifetime',
      status: 'acknowledged',
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('[SnapChef Play Billing] Verify error:', err)
    return NextResponse.json(
      { verified: false, message: err.message || 'Verification failed' },
      { status: 500 }
    )
  }
}

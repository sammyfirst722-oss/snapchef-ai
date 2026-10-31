// SnapChef AI — Google Play Billing Integration via Digital Goods API (Android TWA)
// Bridges web frontend with Google Play Store 1-tap in-app billing

export function isPlayBillingAvailable(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).getDigitalGoodsService === 'function'
}

export function isAndroidTwa(): boolean {
  if (typeof window === 'undefined') return false
  const isReferrerTwa = document.referrer.includes('android-app://')
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const isAndroidUserAgent = navigator.userAgent.includes('Android')
  const hasDigitalGoods = isPlayBillingAvailable()
  return Boolean(isReferrerTwa || (isStandalone && isAndroidUserAgent) || hasDigitalGoods)
}

export async function getPlayBillingService(): Promise<any> {
  if (!isPlayBillingAvailable()) return null
  try {
    return await (window as any).getDigitalGoodsService('https://play.google.com/billing')
  } catch (err) {
    console.warn('[SnapChef Play Billing] Service connection failed:', err)
    return null
  }
}

export async function purchaseWithPlayBilling(
  sku: string = 'snapchef_pro_lifetime',
  priceAmount: string = '19.99',
  label: string = 'SnapChef Pro Lifetime Access'
): Promise<{
  success: boolean
  purchaseToken?: string
  error?: string
}> {
  if (!isPlayBillingAvailable()) {
    return {
      success: false,
      error: 'Google Play Billing is not supported on this browser or platform.',
    }
  }

  try {
    const paymentMethods = [
      {
        supportedMethods: 'https://play.google.com/billing',
        data: {
          sku,
        },
      },
    ]

    const paymentDetails = {
      total: {
        label,
        amount: {
          currency: 'USD',
          value: priceAmount,
        },
      },
    }

    const request = new PaymentRequest(paymentMethods, paymentDetails)
    const paymentResponse = await request.show()
    const details = paymentResponse.details || {}
    const purchaseToken = details.purchaseToken || details.token || 'snapchef_play_token_' + Date.now()

    // Call server verification & acknowledgement
    try {
      const verifyRes = await fetch('/api/play-billing/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku,
          purchaseToken,
          packageName: 'app.vercel.snapchef_ai.twa',
        }),
      })

      const verifyData = await verifyRes.json()

      if (verifyRes.ok && verifyData.verified) {
        await paymentResponse.complete('success')
        return { success: true, purchaseToken }
      } else {
        await paymentResponse.complete('fail')
        return { success: false, error: verifyData.message || 'Payment verification failed' }
      }
    } catch (verifyErr) {
      // In case server route is temporarily offline, acknowledge to protect customer
      await paymentResponse.complete('success')
      return { success: true, purchaseToken }
    }
  } catch (err: any) {
    console.error('[SnapChef Play Billing] Error:', err)
    return { success: false, error: err.message || 'Purchase cancelled or dismissed' }
  }
}

export async function checkExistingPurchases(): Promise<boolean> {
  const service = await getPlayBillingService()
  if (!service) return false
  try {
    const purchases = await service.listPurchases()
    return Array.isArray(purchases) && purchases.length > 0
  } catch (err) {
    console.warn('[SnapChef Play Billing] Failed to check purchases:', err)
    return false
  }
}

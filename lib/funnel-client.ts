import { isAndroidTwa } from '@/lib/play-billing'
import type { BrowserFunnelEvent } from '@/lib/funnel'

// Fire and forget. A failure here must never block the page, the redirect, or the payment.
export function trackFunnel(event: BrowserFunnelEvent, extra: { plan?: 'monthly' | 'lifetime'; reason?: string } = {}) {
  try {
    if (typeof window === 'undefined') return
    const payload = JSON.stringify({ event, surface: isAndroidTwa() ? 'twa' : 'web', ...extra })
    const blob = new Blob([payload], { type: 'application/json' })
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      if (navigator.sendBeacon('/api/funnel', blob)) return
    }
    void fetch('/api/funnel', { method: 'POST', body: payload, keepalive: true }).catch(() => {})
  } catch {
    // ignore
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { BROWSER_EVENTS, cleanReason, recordFunnel, type BrowserFunnelEvent } from '@/lib/funnel'

const MAX_BODY_BYTES = 512

// The browser reports its own steps here. Server-only steps (checkout_created, verify_ok, verify_fail)
// are refused so nobody can fake them.
export async function POST(req: NextRequest) {
  const limited = await rateLimit(`funnel:${getClientIp(req)}`, 60, 60 * 60)
  if (!limited.success) return new NextResponse(null, { status: 429 })

  const text = await req.text().catch(() => '')
  if (!text || new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 400 })
  }
  let body: { event?: unknown; plan?: unknown; surface?: unknown; reason?: unknown }
  try {
    body = JSON.parse(text)
  } catch {
    return new NextResponse(null, { status: 400 })
  }
  if (!body || typeof body !== 'object') return new NextResponse(null, { status: 400 })

  if (typeof body.event !== 'string' || !(BROWSER_EVENTS as readonly string[]).includes(body.event)) {
    return new NextResponse(null, { status: 400 })
  }
  if (body.surface !== 'web' && body.surface !== 'twa') return new NextResponse(null, { status: 400 })
  if (body.plan !== undefined && body.plan !== 'monthly' && body.plan !== 'lifetime') {
    return new NextResponse(null, { status: 400 })
  }

  await recordFunnel({
    event: body.event as BrowserFunnelEvent,
    app: 'snapchef',
    plan: body.plan as 'monthly' | 'lifetime' | undefined,
    surface: body.surface,
    reason: cleanReason(body.reason),
  })
  return new NextResponse(null, { status: 204 })
}

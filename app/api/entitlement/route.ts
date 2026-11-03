import { NextRequest, NextResponse } from 'next/server'
import { enforcementEnabled, isProLookup, lookupRequest } from '@/lib/entitlements'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

// The page asks this on load: "does the server say this browser has Pro?"
// While SERVER_PRO_ENFORCE is off, the page ignores the answer (enforce:false) and keeps the old behaviour.
export async function GET(req: NextRequest) {
  const limited = await rateLimit(`entitlement:${getClientIp(req)}`, 60, 60)
  if (!limited.success) {
    return NextResponse.json({ pro: false, enforce: enforcementEnabled(), reason: 'rate_limited' }, { status: 429 })
  }
  const lookup = await lookupRequest(req)
  return NextResponse.json(
    {
      pro: isProLookup(lookup),
      plan: lookup.state === 'active' ? lookup.plan : null,
      paidThrough: lookup.state === 'active' ? lookup.paidThrough : null,
      unverified: lookup.state === 'unverified',
      enforce: enforcementEnabled(),
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

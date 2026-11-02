// Server-side Google Play purchase check for SnapChef Pro.
// Asks Google whether a purchase token is real, and acknowledges it (Google refunds
// purchases that are not acknowledged within about 3 days). Fails closed: if the check
// cannot be done, nothing is treated as paid.
import { createSign } from 'node:crypto'

export const PLAY_PACKAGE = 'app.vercel.snapchef_ai.twa'

type Kind = 'inapp' | 'subs'
export const PLAY_SKUS: Record<string, { plan: 'lifetime' | 'monthly'; kind: Kind }> = {
  snapchef_pro_lifetime: { plan: 'lifetime', kind: 'inapp' },
  snapchef_pro_monthly: { plan: 'monthly', kind: 'subs' },
}

export type PlayResult =
  | { ok: true; plan: 'lifetime' | 'monthly'; expiresAt?: string }
  | { ok: false; status: number; reason: string }

const fail = (status: number, reason: string): PlayResult => ({ ok: false, status, reason })

let cachedToken: { token: string; exp: number } | null = null

const b64url = (v: Buffer | string) =>
  Buffer.from(v).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

function loadServiceAccount(): { client_email: string; private_key: string; token_uri?: string } | null {
  const raw = (process.env.PLAY_SERVICE_ACCOUNT_JSON || '').trim()
  if (!raw) return null
  try {
    const sa = JSON.parse(raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8'))
    return sa.client_email && sa.private_key ? sa : null
  } catch {
    return null
  }
}

async function getAccessToken(fetchImpl: typeof fetch): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000)
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.token
  const sa = loadServiceAccount()
  if (!sa) return null
  const uri = sa.token_uri || 'https://oauth2.googleapis.com/token'
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = b64url(
    JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/androidpublisher', aud: uri, iat: now, exp: now + 3300 })
  )
  const sig = b64url(createSign('RSA-SHA256').update(`${header}.${claims}`).sign(sa.private_key))
  const res = await fetchImpl(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${header}.${claims}.${sig}` }),
  })
  if (!res.ok) return null
  const j = (await res.json()) as { access_token?: string; expires_in?: number }
  if (!j.access_token) return null
  cachedToken = { token: j.access_token, exp: now + (j.expires_in || 3300) }
  return j.access_token
}

export async function verifyPlayPurchase(
  sku: unknown,
  purchaseToken: unknown,
  opts: { acknowledge?: boolean; fetchImpl?: typeof fetch } = {}
): Promise<PlayResult> {
  const fetchImpl = opts.fetchImpl || fetch
  if (typeof sku !== 'string' || !(sku in PLAY_SKUS)) return fail(402, 'unknown_product')
  if (typeof purchaseToken !== 'string' || !/^[A-Za-z0-9._~\-]{20,2000}$/.test(purchaseToken)) {
    return fail(402, 'invalid_purchase_token')
  }
  const { plan, kind } = PLAY_SKUS[sku]

  let accessToken: string | null
  try {
    accessToken = await getAccessToken(fetchImpl)
  } catch {
    accessToken = null
  }
  if (!accessToken) return fail(503, 'play_verification_not_configured')

  const root = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PLAY_PACKAGE}/purchases`
  const tok = encodeURIComponent(purchaseToken)
  const auth = { Authorization: `Bearer ${accessToken}` }
  const getUrl = kind === 'inapp' ? `${root}/products/${sku}/tokens/${tok}` : `${root}/subscriptionsv2/tokens/${tok}`
  const ackUrl = kind === 'inapp' ? `${root}/products/${sku}/tokens/${tok}:acknowledge` : `${root}/subscriptions/${sku}/tokens/${tok}:acknowledge`

  let res: Response
  try {
    res = await fetchImpl(getUrl, { headers: auth })
  } catch {
    return fail(503, 'play_api_unreachable')
  }
  if (res.status === 401 || res.status === 403) return fail(503, 'play_api_permission')
  if (!res.ok) return fail(402, 'purchase_not_found')
  const p: any = await res.json()

  let expiresAt: string | undefined
  let needsAck = false
  if (kind === 'inapp') {
    if (p.purchaseState !== 0) return fail(402, 'purchase_not_completed') // 0 purchased, 1 canceled, 2 pending
    needsAck = p.acknowledgementState === 0
  } else {
    const item = Array.isArray(p.lineItems) ? p.lineItems.find((l: any) => l.productId === sku) : null
    if (!item) return fail(402, 'purchase_not_found')
    const exp = item.expiryTime ? Date.parse(item.expiryTime) : NaN
    const entitledStates = ['SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD', 'SUBSCRIPTION_STATE_CANCELED']
    // CANCELED still has access until the paid period ends
    if (!entitledStates.includes(p.subscriptionState) || !(exp > Date.now())) return fail(402, 'purchase_not_active')
    expiresAt = new Date(exp).toISOString()
    needsAck = p.acknowledgementState === 'ACKNOWLEDGEMENT_STATE_PENDING'
  }

  if (opts.acknowledge && needsAck) {
    try {
      const ack = await fetchImpl(ackUrl, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: '{}' })
      if (!ack.ok) return fail(502, 'acknowledge_failed')
    } catch {
      return fail(502, 'acknowledge_failed')
    }
  }
  return { ok: true, plan, expiresAt }
}

// Where Stripe sends the buyer back to. The old code trusted the request's Origin header and fell back to
// http://localhost:3000, which could strand a paying customer. This only accepts known addresses.

export const CANONICAL_SITE = 'https://snapchef-ai-eight.vercel.app'

const EXACT_HOSTS = new Set([
  'snapchef-ai-eight.vercel.app',
  'snapchef-ai-sammy.vercel.app', // second address that also serves this app (checked 2026-11-02)
])
// Vercel preview addresses of this project: snapchef-ai-<hash>-sammyfirst722-8735s-projects.vercel.app
const PREVIEW_HOST = /^snapchef-ai(-[a-z0-9-]+)?-sammyfirst722-8735s-projects\.vercel\.app$/
const LOCAL_ORIGINS = new Set(['http://localhost:3000', 'http://localhost:3001'])

function allowedOrigin(origin: string): string | null {
  if (LOCAL_ORIGINS.has(origin)) return origin
  let u: URL
  try {
    u = new URL(origin)
  } catch {
    return null
  }
  if (u.protocol !== 'https:') return null
  if (u.origin !== origin) return null // no path, query, or credentials
  if (EXACT_HOSTS.has(u.host) || PREVIEW_HOST.test(u.host)) return u.origin
  return null
}

export function getSiteUrl(headers: { get(name: string): string | null }): string {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '')
  if (fromEnv) return fromEnv
  const origin = (headers.get('origin') || '').trim()
  return (origin && allowedOrigin(origin)) || CANONICAL_SITE
}

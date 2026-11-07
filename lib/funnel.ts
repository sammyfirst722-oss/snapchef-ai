import { getRedis } from '@/lib/rate-limit'

// Counts steps of the paying funnel so we can see where buyers drop off.
// Counters only. No IP, email, session id or user agent is stored.

export const BROWSER_EVENTS = [
  'checkout_click',
  'checkout_error',
  'checkout_returned',
  'checkout_canceled',
  'pro_unlocked',
] as const

export const SERVER_EVENTS = ['checkout_created', 'verify_ok', 'verify_fail'] as const

export type BrowserFunnelEvent = (typeof BROWSER_EVENTS)[number]
export type FunnelEvent = BrowserFunnelEvent | (typeof SERVER_EVENTS)[number]

export interface FunnelRecord {
  event: FunnelEvent
  app: 'snapchef'
  plan?: 'monthly' | 'lifetime'
  surface: 'web' | 'twa'
  reason?: string
}

// The small slice of Redis this file needs (also what the tests fake).
export interface FunnelStore {
  hincrby(key: string, field: string, by: number): Promise<unknown>
  expire(key: string, seconds: number): Promise<unknown>
  lpush(key: string, value: string): Promise<unknown>
  ltrim(key: string, start: number, stop: number): Promise<unknown>
}

let testStore: FunnelStore | null | undefined
export function _setFunnelStoreForTesting(s: FunnelStore | null | undefined) {
  testStore = s
}

const MAX_REASON = 40
const COUNTER_TTL_SECONDS = 90 * 24 * 60 * 60
const LOG_LENGTH = 500

export function cleanReason(r: unknown): string | undefined {
  if (typeof r !== 'string') return undefined
  const cleaned = r.replace(/[^A-Za-z0-9_.:-]/g, '').slice(0, MAX_REASON)
  return cleaned || undefined
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

const MAX_WAIT_MS = 800

/** Never throws, and never holds a reply for more than MAX_WAIT_MS. Does nothing when Redis is missing or down. */
export async function recordFunnel(r: FunnelRecord, now: Date = new Date()): Promise<void> {
  await Promise.race([write(r, now), new Promise<void>((res) => setTimeout(res, MAX_WAIT_MS).unref?.())])
}

async function write(r: FunnelRecord, now: Date): Promise<void> {
  try {
    const store: FunnelStore | null =
      testStore !== undefined ? testStore : (getRedis() as unknown as FunnelStore | null)
    if (!store) return
    const plan = r.plan === 'monthly' || r.plan === 'lifetime' ? r.plan : '-'
    const surface = r.surface === 'twa' ? 'twa' : 'web'
    const counterKey = `fn:${r.app}:${dayKey(now)}`
    await store.hincrby(counterKey, `${r.event}|${surface}|${plan}`, 1)
    await store.expire(counterKey, COUNTER_TTL_SECONDS)
    const line = JSON.stringify({
      t: now.toISOString(),
      event: r.event,
      surface,
      plan: plan === '-' ? undefined : plan,
      reason: cleanReason(r.reason),
    })
    const logKey = `fnlog:${r.app}`
    await store.lpush(logKey, line)
    await store.ltrim(logKey, 0, LOG_LENGTH - 1)
  } catch {
    // Counting must never break a payment.
  }
}

// Server-side memory of who paid for SnapChef Pro.
//
// How it works (no user accounts):
//  - When the server confirms a paid Stripe session or a Google Play purchase, it makes a long random
//    token, saves a record in Redis, and puts only the token in an httpOnly cookie.
//  - The AI routes read the cookie, look the record up, and apply Pro rules on the server.
//  - A Stripe webhook updates the record (cancel, refund, dispute), so Pro can really be switched off.
//
// Safety rules:
//  - Issuing a NEW entitlement fails closed (needs Redis).
//  - Checking an EXISTING cookie fails open when Redis is briefly down: a paying customer must never be
//    locked out by an outage. A forged cookie only works during an outage and is still capped by the
//    per-IP and site-wide limits in each route.

import { createHash, randomBytes } from 'node:crypto'
import type { NextRequest } from 'next/server'
import { getRedis } from '@/lib/rate-limit'

export const PRO_COOKIE = 'sc_pro'
export const VISITOR_COOKIE = 'sc_vid'
export const PRO_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
export const MONTHLY_GRACE_SECONDS = 3 * 24 * 60 * 60 // renewals and webhooks can run late; do not lock out a payer for that

const TOKEN_RE = /^pro_[A-Za-z0-9_-]{43}$/
const VISITOR_RE = /^v_[A-Za-z0-9_-]{22}$/

export type Plan = 'monthly' | 'lifetime'
export type Source = 'stripe' | 'play'
export type IndexKind = 'cs' | 'pi' | 'sub' | 'play'

export interface EntitlementRecord {
  plan: Plan
  source: Source
  status: 'active' | 'revoked'
  paidThrough: number | null // unix seconds; null = no end (lifetime)
  createdAt: number
  revokedAt?: number
  revokedReason?: string
}

/** The small slice of Redis this file needs. Real Upstash Redis fits it; tests pass a fake. */
export interface Kv {
  get(key: string): Promise<unknown>
  set(key: string, value: unknown, opts?: { nx?: boolean }): Promise<unknown>
}

let testKv: Kv | null = null
export function _setKvForTesting(kv: Kv | null) {
  testKv = kv
}
function kv(): Kv | null {
  if (testKv) return testKv
  // Only use Redis when it is really configured. (The Redis client can be created without settings and then
  // fails on every call, which would look like an outage and make cookies trusted by mistake.)
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return getRedis() as unknown as Kv | null
}

// ---------- flags ----------

/** Server enforcement (free scan cap, Pro verified on the server) is OFF unless this is exactly "true". */
export function enforcementEnabled(): boolean {
  return process.env.SERVER_PRO_ENFORCE === 'true'
}

// ---------- pure helpers (unit-tested) ----------

export function newToken(): string {
  return 'pro_' + randomBytes(32).toString('base64url')
}
export function newVisitorId(): string {
  return 'v_' + randomBytes(16).toString('base64url')
}
export function isWellFormedToken(t: unknown): t is string {
  return typeof t === 'string' && TOKEN_RE.test(t)
}
export function isWellFormedVisitorId(t: unknown): t is string {
  return typeof t === 'string' && VISITOR_RE.test(t)
}
export function hashPlayToken(purchaseToken: string): string {
  return createHash('sha256').update(purchaseToken).digest('hex')
}

export function isRecordActive(rec: EntitlementRecord | null | undefined, nowSeconds: number): boolean {
  if (!rec || rec.status !== 'active') return false
  if (rec.paidThrough == null) return true
  return rec.paidThrough + MONTHLY_GRACE_SECONDS > nowSeconds
}

const recKey = (token: string) => `snapchef:ent:t:${token}`
const ixKey = (kind: IndexKind, id: string) => `snapchef:ent:ix:${kind}:${id}`

// ---------- storage ----------

export interface IssueInput {
  source: Source
  plan: Plan
  paidThrough: number | null
  /** Ids used to find this entitlement again later (session, payment intent, subscription, play token hash). */
  index: Partial<Record<IndexKind, string>>
}

/**
 * Create (or find) the entitlement for a purchase. Safe to call twice for the same purchase:
 * the second call returns the same token (page refresh, webhook arriving before/after the browser).
 * Returns null if Redis is unavailable (fails closed; the caller decides what to tell the buyer),
 * or { revoked: true } if this purchase was refunded/cancelled.
 */
export type IssueResult = { token: string; created: boolean } | { revoked: true } | null

export async function issueEntitlement(input: IssueInput): Promise<IssueResult> {
  const store = kv()
  if (!store) return null
  const ids = (Object.entries(input.index) as Array<[IndexKind, string | undefined]>).filter(
    (e): e is [IndexKind, string] => typeof e[1] === 'string' && e[1].length > 0
  )
  if (ids.length === 0) return null
  try {
    // Already issued for any of these ids? Reuse it, and refresh the pay-through date (renewals).
    for (const [kind, id] of ids) {
      const existing = await store.get(ixKey(kind, id))
      if (isWellFormedToken(existing)) {
        const rec = (await store.get(recKey(existing))) as EntitlementRecord | null
        if (rec && rec.status === 'active') {
          if (input.paidThrough !== rec.paidThrough) {
            await store.set(recKey(existing), { ...rec, paidThrough: input.paidThrough })
          }
          for (const [k2, id2] of ids) await store.set(ixKey(k2, id2), existing, { nx: true })
          return { token: existing, created: false }
        }
        if (rec && rec.status === 'revoked') return { revoked: true } // a refunded purchase never comes back by itself
      }
    }
    const token = newToken()
    const rec: EntitlementRecord = {
      plan: input.plan,
      source: input.source,
      status: 'active',
      paidThrough: input.paidThrough,
      createdAt: Math.floor(Date.now() / 1000),
    }
    await store.set(recKey(token), rec)
    // The first id is a lock: if the browser and the Stripe webhook both get here at the same moment,
    // only one wins (NX = "set only if missing"); the loser uses the winner's token.
    const [firstKind, firstId] = ids[0]
    const won = await store.set(ixKey(firstKind, firstId), token, { nx: true })
    if (!won) {
      const winner = await store.get(ixKey(firstKind, firstId))
      if (isWellFormedToken(winner)) {
        for (const [kind, id] of ids) await store.set(ixKey(kind, id), winner, { nx: true })
        return { token: winner, created: false }
      }
      return null
    }
    for (const [kind, id] of ids.slice(1)) await store.set(ixKey(kind, id), token)
    return { token, created: true }
  } catch (err) {
    console.error('[entitlements] issue failed:', err)
    return null
  }
}

export type Lookup =
  | { state: 'active'; plan: Plan; paidThrough: number | null }
  | { state: 'none' } // no cookie, unknown token, revoked or expired
  | { state: 'unverified' } // Redis was down: a well-formed cookie is trusted for now

export async function lookupToken(token: string | undefined | null, nowSeconds = Math.floor(Date.now() / 1000)): Promise<Lookup> {
  if (!isWellFormedToken(token)) return { state: 'none' }
  const store = kv()
  if (!store) return { state: 'none' } // Redis not set up at all: nothing to verify against
  try {
    const rec = (await store.get(recKey(token))) as EntitlementRecord | null
    if (isRecordActive(rec, nowSeconds)) return { state: 'active', plan: rec!.plan, paidThrough: rec!.paidThrough }
    return { state: 'none' }
  } catch (err) {
    console.error('[entitlements] lookup failed, trusting well-formed cookie:', err)
    return { state: 'unverified' }
  }
}

export async function lookupRequest(req: NextRequest): Promise<Lookup> {
  return lookupToken(req.cookies.get(PRO_COOKIE)?.value)
}

export function isProLookup(l: Lookup): boolean {
  return l.state === 'active' || l.state === 'unverified'
}

/**
 * Find the token behind a Stripe/Play id, if this app ever issued one.
 * Throws if Redis fails (on purpose: the webhook must answer 500 so Stripe retries, not pretend nothing was found).
 */
export async function findToken(kind: IndexKind, id: string): Promise<string | null> {
  const store = kv()
  if (!store || !id) return null
  const t = await store.get(ixKey(kind, id))
  return isWellFormedToken(t) ? t : null
}

async function updateRecord(token: string, patch: (r: EntitlementRecord) => EntitlementRecord): Promise<boolean> {
  const store = kv()
  if (!store) return false
  const rec = (await store.get(recKey(token))) as EntitlementRecord | null
  if (!rec) return false
  await store.set(recKey(token), patch(rec))
  return true
}

/** Pro off right now (refund, dispute, subscription ended). Throws if Redis fails so the webhook is retried. */
export async function revokeToken(token: string, reason: string): Promise<boolean> {
  return updateRecord(token, (r) => ({
    ...r,
    status: 'revoked',
    revokedAt: Math.floor(Date.now() / 1000),
    revokedReason: reason,
  }))
}

/** Subscription renewed or changed: move the pay-through date. Never un-revokes. */
export async function setPaidThrough(token: string, paidThrough: number): Promise<boolean> {
  return updateRecord(token, (r) => (r.status === 'active' ? { ...r, paidThrough } : r))
}

// ---------- cookies ----------

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: PRO_COOKIE_MAX_AGE,
}

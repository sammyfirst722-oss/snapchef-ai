import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { recordFunnel, cleanReason, _setFunnelStoreForTesting } from '@/lib/funnel'
import { makeFakeFunnelStore } from '../helpers/fake-funnel-store'

const DAY = new Date('2026-11-07T10:00:00Z')

describe('recordFunnel', () => {
  let store: ReturnType<typeof makeFakeFunnelStore>
  beforeEach(() => {
    store = makeFakeFunnelStore()
    _setFunnelStoreForTesting(store)
  })
  afterEach(() => _setFunnelStoreForTesting(undefined))

  it('counts repeated events in one hash field', async () => {
    for (let i = 0; i < 3; i++) await recordFunnel({ event: 'checkout_click', app: 'snapchef', plan: 'monthly', surface: 'web' }, DAY)
    expect(store.hashes.get('fn:snapchef:20261107')).toEqual({ 'checkout_click|web|monthly': 3 })
    expect(store.ttl.get('fn:snapchef:20261107')).toBe(90 * 24 * 60 * 60)
  })

  it('uses "-" when there is no plan and keeps twa separate from web', async () => {
    await recordFunnel({ event: 'checkout_returned', app: 'snapchef', surface: 'twa' }, DAY)
    await recordFunnel({ event: 'checkout_returned', app: 'snapchef', surface: 'web' }, DAY)
    expect(store.hashes.get('fn:snapchef:20261107')).toEqual({ 'checkout_returned|twa|-': 1, 'checkout_returned|web|-': 1 })
  })

  it('never throws when Redis is down', async () => {
    store.failing = true
    await expect(recordFunnel({ event: 'verify_ok', app: 'snapchef', surface: 'web' }, DAY)).resolves.toBeUndefined()
  })

  it('does nothing and does not throw when Redis is not configured', async () => {
    _setFunnelStoreForTesting(null)
    await expect(recordFunnel({ event: 'verify_ok', app: 'snapchef', surface: 'web' }, DAY)).resolves.toBeUndefined()
  })

  it('cuts a 200 character reason to 40 and strips markup and newlines', async () => {
    expect(cleanReason('a'.repeat(200))).toHaveLength(40)
    expect(cleanReason('bad<script>\nx')).toBe('badscriptx')
    expect(cleanReason('<>')).toBeUndefined()
    expect(cleanReason(42)).toBeUndefined()
  })

  it('keeps only the newest 500 log lines', async () => {
    for (let i = 0; i < 600; i++) await recordFunnel({ event: 'checkout_click', app: 'snapchef', surface: 'web' }, DAY)
    expect(store.lists.get('fnlog:snapchef')).toHaveLength(500)
  })

  it('stores only the allowed keys in a log line', async () => {
    await recordFunnel({ event: 'verify_fail', app: 'snapchef', surface: 'web', plan: 'lifetime', reason: 'unpaid' }, DAY)
    const line = JSON.parse(store.lists.get('fnlog:snapchef')![0])
    expect(Object.keys(line).sort()).toEqual(['event', 'plan', 'reason', 'surface', 't'])
  })
})

import type { Kv } from '@/lib/entitlements'

// Tiny stand-in for Redis so tests never touch the network. Mimics SET ... NX and a Redis outage.
export function makeFakeKv(): Kv & { map: Map<string, unknown>; failing: boolean } {
  const map = new Map<string, unknown>()
  const kv = {
    map,
    failing: false,
    async get(k: string) {
      if (kv.failing) throw new Error('redis down')
      return map.has(k) ? JSON.parse(JSON.stringify(map.get(k))) : null
    },
    async set(k: string, v: unknown, opts?: { nx?: boolean }) {
      if (kv.failing) throw new Error('redis down')
      if (opts?.nx && map.has(k)) return null
      map.set(k, JSON.parse(JSON.stringify(v)))
      return 'OK'
    },
  }
  return kv
}

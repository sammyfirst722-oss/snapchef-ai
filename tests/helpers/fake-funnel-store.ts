import type { FunnelStore } from '@/lib/funnel'

// Tiny stand-in for the Redis calls the funnel makes. `failing` mimics an outage.
export function makeFakeFunnelStore() {
  const hashes = new Map<string, Record<string, number>>()
  const lists = new Map<string, string[]>()
  const ttl = new Map<string, number>()
  const store: FunnelStore & { hashes: typeof hashes; lists: typeof lists; ttl: typeof ttl; failing: boolean } = {
    hashes,
    lists,
    ttl,
    failing: false,
    async hincrby(key, field, by) {
      if (store.failing) throw new Error('redis down')
      const h = hashes.get(key) || {}
      h[field] = (h[field] || 0) + by
      hashes.set(key, h)
      return h[field]
    },
    async expire(key, seconds) {
      if (store.failing) throw new Error('redis down')
      ttl.set(key, seconds)
      return 1
    },
    async lpush(key, value) {
      if (store.failing) throw new Error('redis down')
      const l = lists.get(key) || []
      l.unshift(value)
      lists.set(key, l)
      return l.length
    },
    async ltrim(key, start, stop) {
      if (store.failing) throw new Error('redis down')
      const l = lists.get(key) || []
      lists.set(key, l.slice(start, stop + 1))
      return 'OK'
    },
  }
  return store
}

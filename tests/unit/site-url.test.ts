import { describe, it, expect, afterEach } from 'vitest'
import { getSiteUrl, CANONICAL_SITE } from '@/lib/site-url'

const h = (origin?: string) => ({ get: (n: string) => (n.toLowerCase() === 'origin' ? origin ?? null : null) })

describe('getSiteUrl', () => {
  const saved = process.env.NEXT_PUBLIC_SITE_URL
  afterEach(() => {
    if (saved === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
    else process.env.NEXT_PUBLIC_SITE_URL = saved
  })

  it('falls back to the real site, never localhost, when there is no Origin', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    expect(getSiteUrl(h())).toBe(CANONICAL_SITE)
    expect(CANONICAL_SITE).toBe('https://snapchef-ai-eight.vercel.app')
  })
  it('refuses a foreign Origin', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    expect(getSiteUrl(h('https://evil.example'))).toBe(CANONICAL_SITE)
    expect(getSiteUrl(h('https://snapchef-ai-eight.vercel.app.evil.example'))).toBe(CANONICAL_SITE)
    expect(getSiteUrl(h('https://evil.example/snapchef-ai-eight.vercel.app'))).toBe(CANONICAL_SITE)
    expect(getSiteUrl(h('http://snapchef-ai-eight.vercel.app'))).toBe(CANONICAL_SITE)
  })
  it('lets localhost, the live address and this project preview addresses through', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    expect(getSiteUrl(h('http://localhost:3000'))).toBe('http://localhost:3000')
    expect(getSiteUrl(h('https://snapchef-ai-eight.vercel.app'))).toBe('https://snapchef-ai-eight.vercel.app')
    const prev = 'https://snapchef-ai-abc123xyz-sammyfirst722-8735s-projects.vercel.app'
    expect(getSiteUrl(h(prev))).toBe(prev)
  })
  it('refuses another project preview address', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    expect(getSiteUrl(h('https://dispute-ninja-abc-sammyfirst722-8735s-projects.vercel.app'))).toBe(CANONICAL_SITE)
  })
  it('uses NEXT_PUBLIC_SITE_URL first, without a trailing slash', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://x.test/'
    expect(getSiteUrl(h('https://evil.example'))).toBe('https://x.test')
  })
})

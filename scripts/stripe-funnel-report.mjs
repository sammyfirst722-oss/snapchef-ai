// Read-only: lists Stripe Checkout Sessions and counts them. Only GET requests, only api.stripe.com.
// Usage: STRIPE_SECRET_KEY=... node scripts/stripe-funnel-report.mjs [outfile]
import fs from 'node:fs'

const key = (process.env.STRIPE_SECRET_KEY || '').trim().replace(/[\r\n"']/g, '')
if (!key) {
  console.error('STRIPE_SECRET_KEY is not set')
  process.exit(2)
}

const sessions = []
let after = ''
for (let page = 0; page < 50; page++) {
  const url =
    'https://api.stripe.com/v1/checkout/sessions?limit=100&expand[]=data.line_items' +
    (after ? `&starting_after=${after}` : '')
  const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` } })
  const j = await res.json().catch(() => ({}))
  if (!res.ok || j.error) {
    console.error('Stripe error:', j.error?.type || res.status)
    process.exit(1)
  }
  sessions.push(...j.data)
  if (!j.has_more) break
  after = j.data[j.data.length - 1].id
}

const rows = {}
let first = Infinity
let last = 0
let paid = 0
let paidCents = 0
for (const s of sessions) {
  const app = s.metadata?.app || 'none'
  const item = s.line_items?.data?.[0]
  const product = app === 'none' ? `${item?.description || 'unknown'} @${item?.amount_total ?? '?'}` : item?.description || ''
  const k = `${app} | ${product} | ${s.status} | ${s.payment_status}`
  rows[k] = (rows[k] || 0) + 1
  first = Math.min(first, s.created)
  last = Math.max(last, s.created)
  if (s.payment_status === 'paid') {
    paid++
    paidCents += s.amount_total || 0
  }
}
const out = [
  `Stripe checkout report, ${new Date().toISOString()}`,
  `sessions: ${sessions.length}   paid: ${paid}   paid total: $${(paidCents / 100).toFixed(2)}`,
  sessions.length
    ? `oldest: ${new Date(first * 1000).toISOString()}   newest: ${new Date(last * 1000).toISOString()}`
    : 'no sessions',
  '',
  ...Object.entries(rows)
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => `${String(n).padStart(4)}  ${k}`),
].join('\n')
console.log(out)
if (process.argv[2]) fs.writeFileSync(process.argv[2], out + '\n')

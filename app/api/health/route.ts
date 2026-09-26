import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const hasOpenRouter = !!process.env.OPENROUTER_API_KEY
  const hasStripe = !!process.env.STRIPE_SECRET_KEY
  const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL)

  const isHealthy = hasOpenRouter && hasStripe

  const healthData = {
    status: isHealthy ? 'healthy' : 'degraded',
    app: 'SnapChef AI',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    checks: {
      openrouterConfigured: hasOpenRouter,
      stripeConfigured: hasStripe,
      redisRateLimitingConfigured: hasRedis,
    },
    version: '1.0.1',
  }

  return NextResponse.json(healthData, {
    status: isHealthy ? 200 : 503,
  })
}

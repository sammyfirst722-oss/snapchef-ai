import { NextRequest, NextResponse } from 'next/server'
import { submitToIndexNow, DEFAULT_HOST } from '@/lib/indexnow'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Rate limit: 10 requests per minute per IP
  const ip = getClientIp(req)
  const result = await rateLimit(`indexnow:${ip}`, 10, 60)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again shortly.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const { urls = ['/'] } = body
    const host = req.headers.get('host') || DEFAULT_HOST

    const result = await submitToIndexNow(urls, host)

    return NextResponse.json(result, {
      status: result.success ? 200 : result.status,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid request payload',
      },
      { status: 400 }
    )
  }
}

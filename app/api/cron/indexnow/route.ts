import { NextRequest, NextResponse } from 'next/server'
import { submitToIndexNow, DEFAULT_HOST } from '@/lib/indexnow'
import { INGREDIENT_PAIRS } from '@/lib/ingredient-pairs-data'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // Verify Vercel Cron Secret if configured
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const host = req.headers.get('host') || DEFAULT_HOST

    // Gather core SEO routes & ingredient pair routes
    const urls = [
      '/',
      '/recipes',
      '/sitemap.xml',
      '/robots.txt',
      ...INGREDIENT_PAIRS.slice(0, 200).map((p) => `/recipes-with/${p.slug}`),
    ]

    const result = await submitToIndexNow(urls, host)

    return NextResponse.json({
      success: result.success,
      submittedUrls: urls.length,
      message: result.message,
      status: result.status,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Graveyard Shift IndexNow Error]:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown cron error',
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import {
  callOpenRouterChat,
  extractJsonFromText,
  getOpenRouterApiKey,
  OPENROUTER_VISION_PRIMARY_MODEL,
  OPENROUTER_BACKUP_MODEL,
  OpenRouterMessage,
} from '@/lib/openrouter'

// Limit: 10 scans per 60 seconds per IP to protect API costs while allowing multi-shelf workflows
const SCAN_LIMIT = 10
const SCAN_WINDOW_SECONDS = 60

// AI calls can take a while: allow up to 60 seconds before Vercel cuts the request off.
export const maxDuration = 60

// Whole-site ceiling per day, so one abuser (or a bug) can never drain the OpenRouter credit.
const GLOBAL_DAILY_CEILING = Number(process.env.SCAN_DAILY_CEILING) || 1500
// Each visitor's own daily budget, far below the site-wide ceiling, so one computer cannot use up everyone's share.
const PER_IP_DAILY_LIMIT = 200

function isValidIngredientList(parsed: any): parsed is string[] {
  return (
    Array.isArray(parsed) &&
    parsed.length > 0 &&
    parsed.every((item) => typeof item === 'string' && item.trim().length > 0)
  )
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rateLimitResult = await rateLimit(`scan-fridge:${ip}`, SCAN_LIMIT, SCAN_WINDOW_SECONDS)

    if (!rateLimitResult.success) {
      const retryAfter = Math.max(1, rateLimitResult.reset - Math.floor(Date.now() / 1000))
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait a minute before scanning again.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
            'Retry-After': String(retryAfter),
          },
        }
      )
    }

    const dailyResult = await rateLimit(`scan-fridge:daily:${ip}`, PER_IP_DAILY_LIMIT, 86400)
    if (!dailyResult.success) {
      return NextResponse.json(
        { error: 'You have reached today\'s scan limit. Please try again tomorrow.', retryAfter: 3600 },
        { status: 429, headers: { 'Retry-After': '3600' } }
      )
    }

    // Site-wide ceiling. Only requests that were allowed count toward it (see lib/rate-limit.ts).
    const globalResult = await rateLimit('scan-fridge:GLOBAL', GLOBAL_DAILY_CEILING, 86400)
    if (!globalResult.success) {
      return NextResponse.json(
        { error: 'SnapChef is very busy right now. Please try again in a little while.', retryAfter: 3600 },
        { status: 429, headers: { 'Retry-After': '3600' } }
      )
    }

    const body = await req.json().catch(() => ({}))
    const rawImages: Array<{ imageBase64?: string; dataUrl?: string; mimeType?: string }> = []

    // Accept multiple photos (up to 5) or single photo for backward compatibility
    if (Array.isArray(body.images) && body.images.length > 0) {
      for (const item of body.images) {
        if (typeof item === 'string' && item.trim()) {
          rawImages.push({ imageBase64: item })
        } else if (item && (item.imageBase64 || item.dataUrl)) {
          rawImages.push(item)
        }
      }
    } else if (body.imageBase64 || body.dataUrl) {
      rawImages.push({
        imageBase64: body.imageBase64 || body.dataUrl,
        mimeType: body.mimeType || 'image/jpeg',
      })
    }

    if (rawImages.length === 0) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const rateLimitHeaders = {
      'X-RateLimit-Limit': String(rateLimitResult.limit),
      'X-RateLimit-Remaining': String(rateLimitResult.remaining),
      'X-RateLimit-Reset': String(rateLimitResult.reset),
    }

    const apiKey = getOpenRouterApiKey()

    if (apiKey) {
      // Build vision image_url objects for up to 5 photos
      const imagePayloads = rawImages.slice(0, 5).map((img) => {
        const src = (img.dataUrl || img.imageBase64 || '').trim()
        const url = src.startsWith('data:')
          ? src
          : `data:${img.mimeType || 'image/jpeg'};base64,${src}`
        return {
          type: 'image_url' as const,
          image_url: { url },
        }
      })

      const photoLabel = imagePayloads.length > 1 ? `these ${imagePayloads.length} photos` : 'this photo'
      const prompt = `Analyze ${photoLabel} of a refrigerator, freezer, pantry, or food countertop.
Identify all recognizable food ingredients, produce, raw proteins, dairy items, pantry staples, and condiments shown across all photos.
Return ONLY a valid JSON array of lowercase ingredient strings, for example:
["eggs", "chicken", "milk", "butter", "spinach", "cheddar cheese", "garlic", "bell pepper"]
Do not include conversational text or markdown code blocks, just raw JSON.`

      const messages: OpenRouterMessage[] = [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            ...imagePayloads,
          ],
        },
      ]

      // Tier 1: Free Primary Vision Model (stealth/space-bunny-alpha)
      try {
        const primaryRes = await callOpenRouterChat({
          model: OPENROUTER_VISION_PRIMARY_MODEL,
          messages,
          maxTokens: 2500,
          temperature: 0.2,
          apiKey,
        })

        if (primaryRes?.content) {
          const parsed = extractJsonFromText<string[]>(primaryRes.content)
          if (isValidIngredientList(parsed)) {
            const uniqueIngredients = Array.from(
              new Set(parsed.map((i) => i.toLowerCase().trim()))
            ).filter(Boolean)

            return NextResponse.json(
              {
                ingredients: uniqueIngredients,
                photoCount: imagePayloads.length,
                source: 'openrouter-primary',
              },
              { headers: rateLimitHeaders }
            )
          }
        }
      } catch (tier1Err) {
        console.warn('Tier 1 vision scan failed:', tier1Err)
      }

      // Tier 2: Backup Vision Model (openai/gpt-4o-mini)
      try {
        const backupRes = await callOpenRouterChat({
          model: OPENROUTER_BACKUP_MODEL,
          messages,
          maxTokens: 300,
          temperature: 0.2,
          apiKey,
        })

        if (backupRes?.content) {
          const parsed = extractJsonFromText<string[]>(backupRes.content)
          if (isValidIngredientList(parsed)) {
            const uniqueIngredients = Array.from(
              new Set(parsed.map((i) => i.toLowerCase().trim()))
            ).filter(Boolean)

            return NextResponse.json(
              {
                ingredients: uniqueIngredients,
                photoCount: imagePayloads.length,
                source: 'openrouter-backup',
              },
              { headers: rateLimitHeaders }
            )
          }
        }
      } catch (tier2Err) {
        console.warn('Tier 2 backup vision scan failed:', tier2Err)
      }
    }

    // Both AI tiers failed (or no key / no credit). Never invent ingredients that are not in the photo:
    // say plainly that scanning is unavailable so the person can add items by hand or try again later.
    return NextResponse.json(
      {
        error: 'Photo scanning is temporarily unavailable. Please add your ingredients by hand, or try again later.',
        source: 'unavailable',
      },
      { status: 503, headers: { ...rateLimitHeaders, 'Retry-After': '300' } }
    )
  } catch (err: any) {
    console.error('Scan fridge error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to analyze fridge image' },
      { status: 500 }
    )
  }
}

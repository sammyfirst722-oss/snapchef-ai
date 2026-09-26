/**
 * SnapChef AI - OpenRouter Service Layer
 * 
 * Provides unified, resilient AI completion for both text recipe generation
 * and multimodal camera fridge scanning with three fallback tiers:
 *   Tier 1: openai/gpt-4o-mini (paid, primary)
 *   Tier 2: openrouter/auto (free backup for recipes) / stealth/space-bunny-alpha (free backup for vision)
 *   Tier 3: Local hardcoded generator / smart detector (last resort, 100% offline reliable)
 */

export const OPENROUTER_PRIMARY_MODEL = 'openai/gpt-4o-mini'
export const OPENROUTER_RECIPE_BACKUP_MODEL = 'openrouter/auto'
export const OPENROUTER_VISION_BACKUP_MODEL = 'stealth/space-bunny-alpha'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const SITE_URL = 'https://snapchef-ai-sammy.vercel.app'
const SITE_TITLE = 'SnapChef AI'
const DEFAULT_TIMEOUT_MS = 30000

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }>
}

export interface CallOpenRouterOptions {
  model: string
  messages: OpenRouterMessage[]
  maxTokens?: number
  temperature?: number
  apiKey?: string
}

/**
 * Retrieves and sanitizes the OpenRouter API key from environment
 */
export function getOpenRouterApiKey(): string | null {
  const rawKey = process.env.OPENROUTER_API_KEY
  if (!rawKey) return null
  const cleaned = rawKey.replace(/^["']|["']$/g, '').trim()
  return cleaned || null
}

/**
 * Robust JSON extractor that strips markdown fences and extracts object/array structures
 */
export function extractJsonFromText<T = any>(rawText: string | null | undefined): T | null {
  if (!rawText || typeof rawText !== 'string') return null

  // Strip markdown code fences
  const clean = rawText
    .replace(/```(?:json)?/gi, '')
    .replace(/```/g, '')
    .trim()

  // 1. Try direct parse first
  try {
    return JSON.parse(clean) as T
  } catch {
    // Continue to substring boundary scanning
  }

  // 2. Find outermost brackets or braces
  const firstBrace = clean.indexOf('{')
  const lastBrace = clean.lastIndexOf('}')
  const firstBracket = clean.indexOf('[')
  const lastBracket = clean.lastIndexOf(']')

  // Decide if this is likely an array or an object
  const hasValidBraces = firstBrace !== -1 && lastBrace > firstBrace
  const hasValidBrackets = firstBracket !== -1 && lastBracket > firstBracket

  if (hasValidBrackets && (!hasValidBraces || firstBracket < firstBrace)) {
    try {
      const arraySubstring = clean.substring(firstBracket, lastBracket + 1)
      return JSON.parse(arraySubstring) as T
    } catch {
      // Fall through to object attempt
    }
  }

  if (hasValidBraces) {
    try {
      const objectSubstring = clean.substring(firstBrace, lastBrace + 1)
      return JSON.parse(objectSubstring) as T
    } catch {
      // Failed to parse
    }
  }

  return null
}

/**
 * Execute chat completion via OpenRouter API with abort timeout
 */
export async function callOpenRouterChat({
  model,
  messages,
  maxTokens = 600,
  temperature = 0.4,
  apiKey,
}: CallOpenRouterOptions): Promise<{ content: string; modelUsed: string } | null> {
  const resolvedKey = apiKey || getOpenRouterApiKey()
  if (!resolvedKey) {
    return null
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resolvedKey}`,
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_TITLE,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '')
      console.warn(`OpenRouter HTTP ${response.status} (${model}):`, errorBody.slice(0, 200))
      return null
    }

    const data = await response.json()
    const choice = data?.choices?.[0]
    const content = choice?.message?.content

    if (!content || typeof content !== 'string') {
      console.warn(`OpenRouter returned empty or null content for model ${model}`)
      return null
    }

    return {
      content: content.trim(),
      modelUsed: data?.model || model,
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      console.warn(`OpenRouter request timed out after ${DEFAULT_TIMEOUT_MS}ms for model ${model}`)
    } else {
      console.warn(`OpenRouter request error for model ${model}:`, err?.message || err)
    }
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

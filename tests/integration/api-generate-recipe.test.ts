import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/generate-recipe/route'
import { rateLimit } from '@/lib/rate-limit'

vi.mock('@/lib/rate-limit', async () => {
  const actual = await vi.importActual<typeof import('@/lib/rate-limit')>('@/lib/rate-limit')
  return {
    ...actual,
    rateLimit: vi.fn(),
  }
})

describe('POST /api/generate-recipe Integration Tests', () => {
  const originalEnv = process.env
  const originalFetch = global.fetch
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.OPENROUTER_API_KEY
    delete process.env.GEMINI_API_KEY
    global.fetch = mockFetch

    // Default: rate limiter allows requests
    vi.mocked(rateLimit).mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: Math.floor(Date.now() / 1000) + 60,
    })
  })

  afterEach(() => {
    process.env = originalEnv
    global.fetch = originalFetch
  })

  function createRequest(body: unknown, headers: Record<string, string> = {}) {
    return new NextRequest('http://localhost:3000/api/generate-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    })
  }

  it('returns 429 when IP rate limit is exceeded', async () => {
    vi.mocked(rateLimit).mockResolvedValueOnce({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Math.floor(Date.now() / 1000) + 45,
    })

    const req = createRequest({ ingredients: ['eggs', 'cheese'] })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(429)
    expect(json.error).toContain('Rate limit exceeded')
    expect(res.headers.get('Retry-After')).toBeDefined()
    expect(res.headers.get('X-RateLimit-Limit')).toBe('5')
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('0')
  })

  it('returns 400 when ingredients are missing or empty', async () => {
    const req = createRequest({ ingredients: [] })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toContain('select or scan at least one ingredient')
  })

  it('successfully generates recipe via Tier 1 Primary (openrouter/auto)', async () => {
    process.env.OPENROUTER_API_KEY = 'sk-or-v1-test-key'

    const mockRecipeData = {
      title: 'Garlic Parmesan Scrambled Eggs',
      category: 'Breakfast',
      prepTime: '3 mins',
      cookTime: '5 mins',
      servings: 2,
      difficulty: 'Easy',
      description: 'Velvety eggs folded with fragrant garlic and aged parmesan.',
      ingredients: [
        { item: 'Eggs', amount: '4 large' },
        { item: 'Parmesan', amount: '2 tbsp' },
      ],
      instructions: [
        'Whisk eggs vigorously until airy.',
        'Cook in butter on low heat, stirring continuously.',
      ],
      chefTip: 'Take eggs off the heat just before they look finished.',
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        model: 'openrouter/auto',
        choices: [{ message: { content: JSON.stringify(mockRecipeData) } }],
      }),
    })

    const req = createRequest({
      ingredients: ['eggs', 'parmesan', 'garlic'],
      preferences: { highProtein: true },
      customPrompt: 'Make it quick',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('openrouter-primary')
    expect(json.recipe.title).toBe('Garlic Parmesan Scrambled Eggs')
    expect(json.recipe.servings).toBe(2)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [fetchUrl, fetchOptions] = mockFetch.mock.calls[0]
    expect(fetchUrl).toBe('https://openrouter.ai/api/v1/chat/completions')
    expect(fetchOptions.headers.Authorization).toBe('Bearer sk-or-v1-test-key')
    const sentBody = JSON.parse(fetchOptions.body)
    expect(sentBody.model).toBe('openrouter/auto')
  })

  it('parses responses wrapped in markdown code fences', async () => {
    process.env.OPENROUTER_API_KEY = 'sk-or-v1-test-key'

    const mockRecipeData = {
      title: 'Crispy Skillet Chicken',
      category: '15-Min Meals',
      prepTime: '5 mins',
      cookTime: '10 mins',
      servings: 2,
      difficulty: 'Easy',
      description: 'Juicy chicken breast seared to golden perfection.',
      ingredients: [{ item: 'Chicken', amount: '2 breasts' }],
      instructions: ['Sear in hot pan for 5 minutes per side.'],
      chefTip: 'Rest the chicken before slicing.',
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        model: 'openrouter/auto',
        choices: [{ message: { content: `\`\`\`json\n${JSON.stringify(mockRecipeData)}\n\`\`\`` } }],
      }),
    })

    const req = createRequest({ ingredients: ['chicken', 'olive oil'] })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('openrouter-primary')
    expect(json.recipe.title).toBe('Crispy Skillet Chicken')
  })

  it('falls back to Tier 2 (openai/gpt-4o-mini) when Tier 1 fails', async () => {
    process.env.OPENROUTER_API_KEY = 'sk-or-v1-test-key'

    const mockBackupRecipe = {
      title: 'Backup Garden Frittata',
      category: 'Breakfast',
      prepTime: '5 mins',
      cookTime: '10 mins',
      servings: 2,
      difficulty: 'Easy',
      description: 'Fluffy eggs baked with garden vegetables.',
      ingredients: [{ item: 'Eggs', amount: '3' }],
      instructions: ['Whisk and cook gently.'],
      chefTip: 'Serve immediately.',
    }

    // Tier 1 fails (HTTP 500 error from upstream provider)
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Provider error',
    })

    // Tier 2 succeeds with openai/gpt-4o-mini
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        model: 'openai/gpt-4o-mini',
        choices: [{ message: { content: JSON.stringify(mockBackupRecipe) } }],
      }),
    })

    const req = createRequest({ ingredients: ['eggs', 'spinach'] })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('openrouter-backup')
    expect(json.recipe.title).toBe('Backup Garden Frittata')

    expect(mockFetch).toHaveBeenCalledTimes(2)
    const tier1Call = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(tier1Call.model).toBe('openrouter/auto')
    const tier2Call = JSON.parse(mockFetch.mock.calls[1][1].body)
    expect(tier2Call.model).toBe('openai/gpt-4o-mini')
  })

  it('falls back to Tier 3 curated generator when both Tier 1 and Tier 2 fail', async () => {
    process.env.OPENROUTER_API_KEY = 'sk-or-v1-test-key'

    // Tier 1 fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => 'Rate limited',
    })

    // Tier 2 fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: async () => 'Service unavailable',
    })

    const req = createRequest({
      ingredients: ['chicken breast', 'rice', 'garlic'],
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('curated-generator')
    expect(json.recipe.title).toContain('chicken breast')
    expect(json.recipe.title).toContain('rice')
  })

  it('uses Tier 3 curated generator when OPENROUTER_API_KEY is not configured', async () => {
    const req = createRequest({
      ingredients: ['tofu', 'noodles', 'soy sauce'],
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('curated-generator')
    expect(json.recipe.title).toContain('tofu')
    expect(json.recipe.title).toContain('noodles')
    expect(mockFetch).not.toHaveBeenCalled()
  })
})

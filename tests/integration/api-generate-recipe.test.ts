import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/generate-recipe/route'
import { rateLimit } from '@/lib/rate-limit'

const { mockGenerateContent, mockGetGenerativeModel } = vi.hoisted(() => {
  const mockGenerateContent = vi.fn()
  const mockGetGenerativeModel = vi.fn().mockReturnValue({
    generateContent: mockGenerateContent,
  })
  return { mockGenerateContent, mockGetGenerativeModel }
})

vi.mock('@/lib/rate-limit', async () => {
  const actual = await vi.importActual<typeof import('@/lib/rate-limit')>('@/lib/rate-limit')
  return {
    ...actual,
    rateLimit: vi.fn(),
  }
})

vi.mock('@google/generative-ai', () => {
  class MockGoogleGenerativeAI {
    constructor(_apiKey: string) {}
    getGenerativeModel = mockGetGenerativeModel
  }
  return {
    GoogleGenerativeAI: MockGoogleGenerativeAI,
  }
})

describe('POST /api/generate-recipe Integration Tests', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.GEMINI_API_KEY

    // Default: rate limiter allows requests
    vi.mocked(rateLimit).mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: Math.floor(Date.now() / 1000) + 60,
    })

    mockGetGenerativeModel.mockReturnValue({
      generateContent: mockGenerateContent,
    })
  })

  afterEach(() => {
    process.env = originalEnv
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

  it('successfully generates recipe via Gemini API with gemini-3.8-flash', async () => {
    process.env.GEMINI_API_KEY = 'test-gemini-key'

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

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify(mockRecipeData),
      },
    })

    const req = createRequest({
      ingredients: ['eggs', 'parmesan', 'garlic'],
      preferences: { highProtein: true },
      customPrompt: 'Make it quick',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('gemini-ai')
    expect(json.recipe.title).toBe('Garlic Parmesan Scrambled Eggs')
    expect(json.recipe.servings).toBe(2)
    expect(mockGetGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gemini-3.8-flash',
        generationConfig: { responseMimeType: 'application/json' },
      })
    )
  })

  it('parses Gemini responses wrapped in markdown code fences', async () => {
    process.env.GEMINI_API_KEY = 'test-gemini-key'

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

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => `\`\`\`json\n${JSON.stringify(mockRecipeData)}\n\`\`\``,
      },
    })

    const req = createRequest({ ingredients: ['chicken', 'olive oil'] })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('gemini-ai')
    expect(json.recipe.title).toBe('Crispy Skillet Chicken')
  })

  it('falls back to curated generator when Gemini API call fails', async () => {
    process.env.GEMINI_API_KEY = 'test-gemini-key'

    mockGenerateContent.mockRejectedValueOnce(new Error('Gemini API quota exhausted'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const req = createRequest({
      ingredients: ['chicken breast', 'rice', 'garlic'],
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('curated-generator')
    expect(json.recipe.title).toContain('chicken breast')
    expect(json.recipe.title).toContain('rice')

    consoleSpy.mockRestore()
  })

  it('uses curated generator when GEMINI_API_KEY is not configured', async () => {
    const req = createRequest({
      ingredients: ['tofu', 'noodles', 'soy sauce'],
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('curated-generator')
    expect(json.recipe.title).toContain('tofu')
    expect(json.recipe.title).toContain('noodles')
  })
})

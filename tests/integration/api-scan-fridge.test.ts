import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/scan-fridge/route'
import { rateLimit } from '@/lib/rate-limit'

vi.mock('@/lib/rate-limit', async () => {
  const actual = await vi.importActual<typeof import('@/lib/rate-limit')>('@/lib/rate-limit')
  return {
    ...actual,
    rateLimit: vi.fn(),
  }
})

describe('POST /api/scan-fridge Integration Tests', () => {
  const originalEnv = process.env
  const originalFetch = global.fetch
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.OPENROUTER_API_KEY
    delete process.env.GEMINI_API_KEY
    global.fetch = mockFetch

    // Default rate limit allow
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

  function createRequest(body: unknown) {
    return new NextRequest('http://localhost:3000/api/scan-fridge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }

  it('returns 429 when IP rate limit is exceeded', async () => {
    vi.mocked(rateLimit).mockResolvedValueOnce({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Math.floor(Date.now() / 1000) + 30,
    })

    const req = createRequest({ imageBase64: 'data:image/jpeg;base64,abc123mock' })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(429)
    expect(json.error).toContain('Rate limit exceeded')
    expect(res.headers.get('Retry-After')).toBeDefined()
    expect(res.headers.get('X-RateLimit-Limit')).toBe('5')
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('0')
  })

  it('returns 400 when imageBase64 is missing', async () => {
    const req = createRequest({})
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toContain('No image provided')
  })

  it('successfully analyzes image with Tier 1 Primary Vision model (openai/gpt-4o-mini)', async () => {
    process.env.OPENROUTER_API_KEY = 'sk-or-v1-test-key'

    const detected = ['eggs', 'cheddar cheese', 'bell pepper', 'butter']
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        model: 'openai/gpt-4o-mini',
        choices: [{ message: { content: JSON.stringify(detected) } }],
      }),
    })

    const req = createRequest({
      imageBase64: 'data:image/jpeg;base64,validBase64ImageContent',
      mimeType: 'image/jpeg',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('openrouter-primary')
    expect(json.ingredients).toEqual(detected)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [fetchUrl, fetchOptions] = mockFetch.mock.calls[0]
    expect(fetchUrl).toBe('https://openrouter.ai/api/v1/chat/completions')
    const sentBody = JSON.parse(fetchOptions.body)
    expect(sentBody.model).toBe('openai/gpt-4o-mini')
    expect(sentBody.messages[0].content).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'text' }),
        expect.objectContaining({
          type: 'image_url',
          image_url: { url: 'data:image/jpeg;base64,validBase64ImageContent' },
        }),
      ])
    )
  })

  it('parses array responses enclosed in markdown code blocks', async () => {
    process.env.OPENROUTER_API_KEY = 'sk-or-v1-test-key'

    const detected = ['salmon fillet', 'asparagus', 'lemon']
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        model: 'openai/gpt-4o-mini',
        choices: [{ message: { content: `\`\`\`json\n${JSON.stringify(detected)}\n\`\`\`` } }],
      }),
    })

    const req = createRequest({
      imageBase64: 'rawBase64WithoutPrefix',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('openrouter-primary')
    expect(json.ingredients).toEqual(detected)
  })

  it('falls back to Tier 2 (stealth/space-bunny-alpha) when Tier 1 vision fails', async () => {
    process.env.OPENROUTER_API_KEY = 'sk-or-v1-test-key'

    const backupDetected = ['milk', 'yogurt', 'berries']

    // Tier 1 fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Provider error',
    })

    // Tier 2 succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        model: 'stealth/space-bunny-alpha',
        choices: [{ message: { content: JSON.stringify(backupDetected) } }],
      }),
    })

    const req = createRequest({ imageBase64: 'testImage' })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('openrouter-backup')
    expect(json.ingredients).toEqual(backupDetected)

    expect(mockFetch).toHaveBeenCalledTimes(2)
    const tier2Call = JSON.parse(mockFetch.mock.calls[1][1].body)
    expect(tier2Call.model).toBe('stealth/space-bunny-alpha')
  })

  it('falls back to Tier 3 smart detection preview when both AI tiers fail', async () => {
    process.env.OPENROUTER_API_KEY = 'sk-or-v1-test-key'

    // Tier 1 fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => 'Quota exceeded',
    })

    // Tier 2 fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: async () => 'Service error',
    })

    const req = createRequest({
      imageBase64: 'testImage',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('smart-detect-preview')
    expect(json.ingredients).toContain('eggs')
    expect(json.ingredients).toContain('chicken')
  })

  it('uses Tier 3 smart detection preview when OPENROUTER_API_KEY is not set', async () => {
    const req = createRequest({
      imageBase64: 'testImage',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('smart-detect-preview')
    expect(Array.isArray(json.ingredients)).toBe(true)
    expect(json.ingredients.length).toBeGreaterThan(0)
    expect(mockFetch).not.toHaveBeenCalled()
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/scan-fridge/route'
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

describe('POST /api/scan-fridge Integration Tests', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.GEMINI_API_KEY

    // Default rate limit allow
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

  it('successfully analyzes image with Gemini 3.8 Flash Vision model', async () => {
    process.env.GEMINI_API_KEY = 'test-gemini-key'

    const detected = ['eggs', 'cheddar cheese', 'bell pepper', 'butter']
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify(detected),
      },
    })

    const req = createRequest({
      imageBase64: 'data:image/jpeg;base64,validBase64ImageContent',
      mimeType: 'image/jpeg',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('gemini-vision')
    expect(json.ingredients).toEqual(detected)
    expect(mockGetGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gemini-3.8-flash',
        generationConfig: { responseMimeType: 'application/json' },
      })
    )
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.any(String),
        expect.objectContaining({
          inlineData: {
            data: 'validBase64ImageContent',
            mimeType: 'image/jpeg',
          },
        }),
      ])
    )
  })

  it('parses Gemini array responses enclosed in markdown code blocks', async () => {
    process.env.GEMINI_API_KEY = 'test-gemini-key'

    const detected = ['salmon fillet', 'asparagus', 'lemon']
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => `\`\`\`json\n${JSON.stringify(detected)}\n\`\`\``,
      },
    })

    const req = createRequest({
      imageBase64: 'rawBase64WithoutPrefix',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('gemini-vision')
    expect(json.ingredients).toEqual(detected)
  })

  it('falls back to smart detection preview when Gemini API throws', async () => {
    process.env.GEMINI_API_KEY = 'test-gemini-key'

    mockGenerateContent.mockRejectedValueOnce(new Error('Gemini Vision internal failure'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const req = createRequest({
      imageBase64: 'testImage',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('smart-detect-preview')
    expect(json.ingredients).toContain('eggs')
    expect(json.ingredients).toContain('chicken')

    consoleSpy.mockRestore()
  })

  it('uses smart detection preview when GEMINI_API_KEY is not set', async () => {
    const req = createRequest({
      imageBase64: 'testImage',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.source).toBe('smart-detect-preview')
    expect(Array.isArray(json.ingredients)).toBe(true)
    expect(json.ingredients.length).toBeGreaterThan(0)
  })
})

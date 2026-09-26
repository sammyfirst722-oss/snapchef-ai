/**
 * IndexNow Search Engine Discovery Utility
 * Automatically notifies Bing, Yandex, Naver, and participating search engines
 * whenever new pages or recipes are published.
 */

export const INDEXNOW_KEY = 'e4f5a892b1044cbcae7832dbfa961e05'
export const DEFAULT_HOST = 'snapchef-ai-eight.vercel.app'

export interface IndexNowResponse {
  success: boolean
  status: number
  message: string
}

export async function submitToIndexNow(
  urls: string[],
  host = DEFAULT_HOST
): Promise<IndexNowResponse> {
  if (!urls || urls.length === 0) {
    return { success: false, status: 400, message: 'No URLs provided' }
  }

  // Ensure absolute URLs
  const formattedUrls = urls.map((url) =>
    url.startsWith('http') ? url : `https://${host}${url.startsWith('/') ? '' : '/'}${url}`
  )

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
    urlList: formattedUrls,
  }

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    })

    // IndexNow returns 200, 202, or 204 on success
    const success = response.status >= 200 && response.status < 300

    return {
      success,
      status: response.status,
      message: success
        ? `Successfully submitted ${formattedUrls.length} URL(s) to IndexNow`
        : `IndexNow returned status ${response.status}`,
    }
  } catch (error) {
    console.error('[IndexNow Error]:', error)
    return {
      success: false,
      status: 500,
      message: error instanceof Error ? error.message : 'Unknown network error',
    }
  }
}

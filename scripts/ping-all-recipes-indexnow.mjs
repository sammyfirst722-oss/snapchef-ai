/**
 * Submits all 520 static recipe pages and directory to IndexNow
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INDEXNOW_KEY = 'e4f5a892b1044cbcae7832dbfa961e05'
const DEFAULT_HOST = 'snapchef-ai-eight.vercel.app'

async function pingAll() {
  const recipesFilePath = path.join(__dirname, '..', 'lib', 'recipes-data.ts')
  const content = fs.readFileSync(recipesFilePath, 'utf8')

  const idMatches = content.match(/"id":\s*"(rec-\d+)"/g) || []
  const recipeIds = idMatches.map((m) => m.match(/"(rec-\d+)"/)[1])

  console.log(`Found ${recipeIds.length} recipes in recipes-data.ts`)

  const rawUrls = [
    '/',
    '/recipes',
    '/privacy',
    '/terms',
    '/account-deletion',
    ...recipeIds.map((id) => `/recipe/${id}`),
  ]

  const formattedUrls = rawUrls.map((url) =>
    url.startsWith('http') ? url : `https://${DEFAULT_HOST}${url.startsWith('/') ? '' : '/'}${url}`
  )

  console.log(`Submitting ${formattedUrls.length} total URLs to api.indexnow.org...`)

  const payload = {
    host: DEFAULT_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${DEFAULT_HOST}/${INDEXNOW_KEY}.txt`,
    urlList: formattedUrls,
  }

  const response = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  })

  console.log(`HTTP Status: ${response.status} ${response.statusText}`)
  if (response.status >= 200 && response.status < 300) {
    console.log(`Successfully batch-submitted all ${formattedUrls.length} URLs to IndexNow!`)
  } else {
    const text = await response.text()
    console.error(`IndexNow submission error:`, text)
  }
}

pingAll().catch(console.error)

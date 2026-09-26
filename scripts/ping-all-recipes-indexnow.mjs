/**
 * Submits all 110 static recipe pages and directory to IndexNow
 */

import { INDEXNOW_KEY, DEFAULT_HOST, submitToIndexNow } from '../lib/indexnow.js'
import { RECIPES_DATA } from '../lib/recipes-data.js'

async function pingAll() {
  console.log(`Preparing to submit ${RECIPES_DATA.length} recipes to IndexNow...`)

  const urls = [
    '/',
    '/recipes',
    '/privacy',
    '/terms',
    '/account-deletion',
    ...RECIPES_DATA.map((r) => `/recipe/${r.id}`),
  ]

  console.log(`Total URLs to submit: ${urls.length}`)

  // IndexNow accepts up to 10,000 URLs per post
  const res = await submitToIndexNow(urls, DEFAULT_HOST)
  console.log('IndexNow Response:', res)
}

pingAll().catch(console.error)

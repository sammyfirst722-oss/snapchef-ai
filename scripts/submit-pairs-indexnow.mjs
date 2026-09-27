import { fileURLToPath, pathToFileURL } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const KEY = 'e4f5a892b1044cbcae7832dbfa961e05'
const HOST = 'snapchef-ai-eight.vercel.app'

async function run() {
  const dataModule = await import(pathToFileURL(path.join(ROOT, 'lib', 'ingredient-pairs-data.ts')).href)
  const pairs = dataModule.INGREDIENT_PAIRS

  console.log(`Found ${pairs.length} ingredient pair pages to submit to IndexNow.`)

  const urls = [
    `https://${HOST}/sitemap.xml`,
    `https://${HOST}/robots.txt`,
    ...pairs.map((p) => `https://${HOST}/recipes-with/${p.slug}`)
  ]

  console.log(`Total URLs to submit: ${urls.length}`)

  const CHUNK_SIZE = 500
  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunk = urls.slice(i, i + CHUNK_SIZE)
    console.log(`Submitting batch ${Math.floor(i / CHUNK_SIZE) + 1} (${chunk.length} URLs)...`)

    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: chunk,
    }

    try {
      const res = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      })
      console.log(`  ➔ Response HTTP ${res.status} (${res.statusText || 'OK'})`)
    } catch (err) {
      console.error('  ➔ Request failed:', err.message)
    }
  }
}

run()

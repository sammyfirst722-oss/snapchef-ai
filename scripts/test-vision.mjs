import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8')
const keyMatch = env.match(/OPENROUTER_API_KEY=(.*)/)
const key = keyMatch ? keyMatch[1].trim().replace(/^['"]|['"]$/g, '') : null

const tinyBase64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

async function testMultiImage() {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'stealth/space-bunny-alpha',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze these 2 photos of food shelves. Return JSON array of items: ["item1"]' },
              { type: 'image_url', image_url: { url: tinyBase64 } },
              { type: 'image_url', image_url: { url: tinyBase64 } },
            ],
          },
        ],
      }),
    })
    const data = await res.json()
    console.log(`Multi-image test => Status: ${res.status}, Answer: ${data.choices?.[0]?.message?.content?.slice(0, 100) || data.error?.message}`)
  } catch (err) {
    console.error(`Multi-image error: ${err.message}`)
  }
}

await testMultiImage()

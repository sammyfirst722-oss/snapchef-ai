import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recipesPath = path.join(__dirname, '..', 'lib', 'recipes-data.ts');
const content = fs.readFileSync(recipesPath, 'utf8');

const match = content.match(/export const RECIPES_DATA: Recipe\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not find RECIPES_DATA");
  process.exit(1);
}

const recipes = eval(match[1]);
console.log(`Found ${recipes.length} recipes to submit.`);

const HOST = 'snapchef-ai-eight.vercel.app';
const KEY = 'e4f5a892b1044cbcae7832dbfa961e05';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const urls = [
  `https://${HOST}/`,
  `https://${HOST}/recipes`,
  `https://${HOST}/privacy`,
  `https://${HOST}/terms`,
  `https://${HOST}/account-deletion`,
  ...recipes.map((r) => `https://${HOST}/recipe/${r.id}`)
];

console.log(`Submitting ${urls.length} URLs to IndexNow (Bing, Yandex, Microsoft)...`);

async function submit() {
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls,
      }),
    });

    console.log(`IndexNow response: HTTP ${res.status} ${res.statusText}`);
    if (res.status === 200 || res.status === 202) {
      console.log(`✅ Successfully submitted all ${urls.length} URLs to search engines via IndexNow!`);
    } else {
      const txt = await res.text();
      console.warn(`Response details:`, txt);
    }
  } catch (err) {
    console.error('Failed to submit to IndexNow:', err);
  }
}

await submit();

import { MetadataRoute } from 'next'
import { RECIPES_DATA } from '@/lib/recipes-data'
import { INGREDIENT_PAIRS } from '@/lib/ingredient-pairs-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://snapchef-ai-eight.vercel.app'
  const now = new Date()

  // 1. Core static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // 2. Programmatic Ingredient Pair collections
  const pairPages: MetadataRoute.Sitemap = INGREDIENT_PAIRS.map((pair) => ({
    url: `${baseUrl}/recipes-with/${pair.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 3. Individual recipe detail pages
  const recipePages: MetadataRoute.Sitemap = RECIPES_DATA.map((recipe) => ({
    url: `${baseUrl}/recipe/${recipe.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...pairPages, ...recipePages]
}

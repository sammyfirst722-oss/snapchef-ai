import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import {
  callOpenRouterChat,
  extractJsonFromText,
  getOpenRouterApiKey,
  OPENROUTER_RECIPE_PRIMARY_MODEL,
  OPENROUTER_BACKUP_MODEL,
} from '@/lib/openrouter'

// Limit: 5 recipe generations per 60 seconds per IP to protect API costs
const RECIPE_LIMIT = 5
const RECIPE_WINDOW_SECONDS = 60

interface RecipePayload {
  title: string
  category: string
  prepTime: string
  cookTime: string
  servings: number
  difficulty: string
  description: string
  ingredients: Array<{ item: string; amount: string }>
  instructions: string[]
  chefTip?: string
}

function isValidRecipe(recipe: any): recipe is RecipePayload {
  return (
    recipe &&
    typeof recipe === 'object' &&
    typeof recipe.title === 'string' &&
    recipe.title.trim().length > 0 &&
    Array.isArray(recipe.ingredients) &&
    recipe.ingredients.length > 0 &&
    Array.isArray(recipe.instructions) &&
    recipe.instructions.length > 0
  )
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rateLimitResult = await rateLimit(`generate-recipe:${ip}`, RECIPE_LIMIT, RECIPE_WINDOW_SECONDS)

    if (!rateLimitResult.success) {
      const retryAfter = Math.max(1, rateLimitResult.reset - Math.floor(Date.now() / 1000))
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait a minute before generating another recipe.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
            'Retry-After': String(retryAfter),
          },
        }
      )
    }

    const { ingredients = [], preferences = {}, customPrompt = '' } = await req.json()

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Please select or scan at least one ingredient first!' },
        { status: 400 }
      )
    }

    const rateLimitHeaders = {
      'X-RateLimit-Limit': String(rateLimitResult.limit),
      'X-RateLimit-Remaining': String(rateLimitResult.remaining),
      'X-RateLimit-Reset': String(rateLimitResult.reset),
    }

    const apiKey = getOpenRouterApiKey()

    if (apiKey) {
      const prompt = `You are SnapChef AI, a Michelin-trained home chef who specializes in turning leftover fridge ingredients into fast, delicious, restaurant-quality meals.
Available Ingredients: ${ingredients.join(', ')}
Dietary Requirements: ${JSON.stringify(preferences)}
User Note: ${customPrompt || 'Create a quick, delicious 15-20 min meal using these ingredients.'}

Respond ONLY with a valid JSON object matching this schema:
{
  "title": "Creative Dish Name",
  "category": "Dinner | 15-Min Meals | Breakfast | Pasta | One-Pot",
  "prepTime": "X mins",
  "cookTime": "X mins",
  "servings": 2,
  "difficulty": "Easy",
  "description": "Appetizing 1-2 sentence description of the dish.",
  "ingredients": [
    { "item": "Ingredient name", "amount": "e.g. 2 tbsp" }
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction",
    "Step 3 instruction"
  ],
  "chefTip": "A quick pro chef tip to elevate the flavor."
}
Do not include any conversational fluff, markdown backticks, or text outside the JSON object.`

      const messages = [
        {
          role: 'user' as const,
          content: prompt,
        },
      ]

      // Tier 1: Free Primary Router (openrouter/auto)
      try {
        const primaryRes = await callOpenRouterChat({
          model: OPENROUTER_RECIPE_PRIMARY_MODEL,
          messages,
          maxTokens: 800,
          temperature: 0.4,
          apiKey,
        })

        if (primaryRes?.content) {
          const parsed = extractJsonFromText<RecipePayload>(primaryRes.content)
          if (isValidRecipe(parsed)) {
            return NextResponse.json(
              { recipe: parsed, source: 'openrouter-primary' },
              { headers: rateLimitHeaders }
            )
          }
        }
      } catch (tier1Err) {
        console.warn('Tier 1 free recipe generation failed:', tier1Err)
      }

      // Tier 2: Paid Backup Model (openai/gpt-4o-mini)
      try {
        const backupRes = await callOpenRouterChat({
          model: OPENROUTER_BACKUP_MODEL,
          messages,
          maxTokens: 800,
          temperature: 0.4,
          apiKey,
        })

        if (backupRes?.content) {
          const parsed = extractJsonFromText<RecipePayload>(backupRes.content)
          if (isValidRecipe(parsed)) {
            return NextResponse.json(
              { recipe: parsed, source: 'openrouter-backup' },
              { headers: rateLimitHeaders }
            )
          }
        }
      } catch (tier2Err) {
        console.warn('Tier 2 paid backup recipe generation failed:', tier2Err)
      }
    }

    // Tier 3: High quality intelligent recipe generator fallback (Zero-AI, always reliable)
    const mainProtein =
      ingredients.find((i: string) =>
        ['chicken', 'beef', 'eggs', 'bacon', 'tofu', 'salmon'].some((p) =>
          i.toLowerCase().includes(p)
        )
      ) || 'Protein'

    const mainCarb =
      ingredients.find((i: string) =>
        ['rice', 'pasta', 'potato', 'bread', 'noodles'].some((c) =>
          i.toLowerCase().includes(c)
        )
      ) || 'Stir-Fry'

    const fallbackRecipe = {
      title: `Crispy Golden ${mainProtein} & ${mainCarb} Skillet`,
      category: '15-Min Meals',
      prepTime: '5 mins',
      cookTime: '12 mins',
      servings: 2,
      difficulty: 'Easy',
      description: `A sizzling, flavor-packed skillet dinner crafted right from your active fridge ingredients: ${ingredients.slice(0, 4).join(', ')}.`,
      ingredients: ingredients.map((ing: string) => ({
        item: ing,
        amount: 'To taste',
      })),
      instructions: [
        'Heat 1 tablespoon of butter or oil in a large skillet over medium-high heat until hot and shimmering.',
        `Add your ${ingredients[0] || 'primary ingredient'} and sear for 4–5 minutes until golden and fragrant.`,
        `Toss in the remaining ingredients (${ingredients.slice(1).join(', ') || 'seasonings'}) and stir continuously for 3–4 minutes until tender.`,
        'Season generously with salt, freshly cracked black pepper, and garlic.',
        'Remove from heat, plate immediately hot, and garnish with fresh herbs or extra cheese.',
      ],
      chefTip: 'For extra crispiness, don’t overcrowd the skillet—let each ingredient get direct contact with the pan!',
    }

    return NextResponse.json(
      { recipe: fallbackRecipe, source: 'curated-generator' },
      { headers: rateLimitHeaders }
    )
  } catch (err: any) {
    console.error('Generate recipe error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to generate recipe' },
      { status: 500 }
    )
  }
}

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

    const {
      ingredients = [],
      preferences = {},
      customPrompt = '',
      count = 3,
      previousTitles = [],
    } = await req.json()

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
      const prompt = `You are SnapChef AI, an expert home chef specializing in simple, delicious meals using ONLY whatever ingredients are in the fridge.
Available Ingredients: ${ingredients.join(', ')}
Dietary Preferences: ${JSON.stringify(preferences)}
User Note: ${customPrompt || 'Create simple, comforting everyday meals with these ingredients.'}
Previous Meals Generated (Do NOT repeat): ${previousTitles.join(', ')}

Please generate ${Math.min(count, 5)} DISTINCT, creative, easy-to-cook meals (e.g. a fast 10-min meal, a one-pan dinner, a comforting scramble or bowl). Assume standard pantry basics (salt, pepper, oil, water, butter) are available.

Respond ONLY with a valid JSON object matching this schema:
{
  "recipes": [
    {
      "title": "Creative Dish Name",
      "category": "Quick Dinners | 15-Min Meals | Breakfast | One-Pot",
      "prepTime": "X mins",
      "cookTime": "X mins",
      "servings": 2,
      "difficulty": "Easy",
      "description": "Appetizing 1-2 sentence description.",
      "ingredients": [
        { "item": "Ingredient name", "amount": "e.g. 2 tbsp" }
      ],
      "instructions": [
        "Step 1 instruction",
        "Step 2 instruction",
        "Step 3 instruction"
      ],
      "chefTip": "A quick pro tip."
    }
  ]
}
Do not include any conversational text or markdown code fences outside the JSON.`

      const messages = [
        {
          role: 'user' as const,
          content: prompt,
        },
      ]

      const parseRecipes = (rawText: string | null | undefined): RecipePayload[] => {
        if (!rawText) return []
        const parsed = extractJsonFromText<any>(rawText)
        if (!parsed) return []
        if (Array.isArray(parsed.recipes)) {
          return parsed.recipes.filter(isValidRecipe)
        }
        if (isValidRecipe(parsed)) {
          return [parsed]
        }
        return []
      }

      // Tier 1: Free Primary Router (openrouter/auto)
      try {
        const primaryRes = await callOpenRouterChat({
          model: OPENROUTER_RECIPE_PRIMARY_MODEL,
          messages,
          maxTokens: 1500,
          temperature: 0.5,
          apiKey,
        })

        const recipes = parseRecipes(primaryRes?.content)
        if (recipes.length > 0) {
          return NextResponse.json(
            { recipe: recipes[0], recipes, source: 'openrouter-primary' },
            { headers: rateLimitHeaders }
          )
        }
      } catch (tier1Err) {
        console.warn('Tier 1 free recipe generation failed:', tier1Err)
      }

      // Tier 2: Paid Backup Model (openai/gpt-4o-mini)
      try {
        const backupRes = await callOpenRouterChat({
          model: OPENROUTER_BACKUP_MODEL,
          messages,
          maxTokens: 1500,
          temperature: 0.5,
          apiKey,
        })

        const recipes = parseRecipes(backupRes?.content)
        if (recipes.length > 0) {
          return NextResponse.json(
            { recipe: recipes[0], recipes, source: 'openrouter-backup' },
            { headers: rateLimitHeaders }
          )
        }
      } catch (tier2Err) {
        console.warn('Tier 2 paid backup recipe generation failed:', tier2Err)
      }
    }

    // Tier 3: High quality intelligent recipe generator fallback (Zero-AI, always reliable)
    const mainProtein =
      ingredients.find((i: string) =>
        ['chicken', 'beef', 'eggs', 'bacon', 'tofu', 'salmon', 'ham', 'sausage'].some((p) =>
          i.toLowerCase().includes(p)
        )
      ) || 'Protein'

    const mainCarb =
      ingredients.find((i: string) =>
        ['rice', 'pasta', 'potato', 'bread', 'noodles', 'tortilla'].some((c) =>
          i.toLowerCase().includes(c)
        )
      ) || 'Stir-Fry'

    const fallbackRecipe1: RecipePayload = {
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

    const fallbackRecipe2: RecipePayload = {
      title: `Savory ${mainProtein} Comfort Bowl`,
      category: 'Quick Dinners',
      prepTime: '4 mins',
      cookTime: '8 mins',
      servings: 2,
      difficulty: 'Easy',
      description: `A warm, satisfying bowl combining seared ${mainProtein} with tender ${mainCarb} and melted savory toppings.`,
      ingredients: ingredients.map((ing: string) => ({
        item: ing,
        amount: 'To taste',
      })),
      instructions: [
        `Gently warm your ${mainCarb} in a pan or microwave until soft and steaming.`,
        `In a separate pan, sauté ${mainProtein} with butter or oil until thoroughly cooked and browned.`,
        'Spoon the ingredients together in a wide bowl and toss with seasonings or pan drippings.',
        'Top with any cheese or sauces on hand, allowing the residual heat to melt everything together.',
      ],
      chefTip: 'A splash of soy sauce or hot sauce brings all the ingredients together seamlessly!',
    }

    const fallbackRecipe3: RecipePayload = {
      title: `10-Minute ${mainProtein} Pantry Stir Fry`,
      category: 'One-Pot',
      prepTime: '3 mins',
      cookTime: '7 mins',
      servings: 2,
      difficulty: 'Easy',
      description: `A fast, flexible stir fry utilizing your fresh ingredients: ${ingredients.join(', ')}.`,
      ingredients: ingredients.map((ing: string) => ({
        item: ing,
        amount: 'To taste',
      })),
      instructions: [
        'Get your pan screaming hot with a drizzle of cooking oil.',
        `Quickly flash-fry ${ingredients.slice(0, 3).join(', ')} for 3-4 minutes to develop a nice char.`,
        'Add a splash of water, broth, or soy sauce to create a quick pan glaze.',
        'Toss vigorously for 1 minute and serve hot.',
      ],
      chefTip: 'Cooking on high heat keeps the vegetables crisp and preserves their natural sweetness.',
    }

    const fallbackRecipes = [fallbackRecipe1, fallbackRecipe2, fallbackRecipe3]

    return NextResponse.json(
      { recipe: fallbackRecipes[0], recipes: fallbackRecipes, source: 'curated-generator' },
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

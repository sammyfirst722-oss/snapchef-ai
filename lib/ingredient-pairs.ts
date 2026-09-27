import { RECIPES_DATA, Recipe } from './recipes-data'
import {
  INGREDIENT_PAIRS,
  INGREDIENT_PAIRS_MAP,
  IngredientPair,
} from './ingredient-pairs-data'

export type { IngredientPair }
export { INGREDIENT_PAIRS, INGREDIENT_PAIRS_MAP }

// Cache recipe map by ID for O(1) lookups
const RECIPES_BY_ID = new Map<string, Recipe>(
  RECIPES_DATA.map((r) => [r.id, r])
)

function slugifyKey(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

/**
 * Returns all recipes that contain both ingredients in the specified pair slug.
 */
export function getRecipesForPair(slug: string): Recipe[] {
  const pair = INGREDIENT_PAIRS_MAP[slug.toLowerCase().trim()]
  if (!pair) return []

  const recipes: Recipe[] = []
  for (const id of pair.recipeIds) {
    const r = RECIPES_BY_ID.get(id)
    if (r) recipes.push(r)
  }
  return recipes
}

/**
 * Returns top ingredient pair collections related to a recipe (for two-way internal linking).
 */
export function getRelatedPairsForRecipe(recipe: Recipe, limit = 4): IngredientPair[] {
  if (!recipe || !recipe.ingredients) return []

  const keys = new Set(
    recipe.ingredients
      .map((i) => (i.standardKey ? slugifyKey(i.standardKey) : ''))
      .filter(Boolean)
  )

  const matches: IngredientPair[] = []
  for (const pair of INGREDIENT_PAIRS) {
    if (keys.has(pair.keyA) && keys.has(pair.keyB)) {
      matches.push(pair)
      if (matches.length >= limit) break
    }
  }

  return matches
}

import { describe, it, expect } from 'vitest'
import {
  INGREDIENT_PAIRS,
  INGREDIENT_PAIRS_MAP,
  getRecipesForPair,
  getRelatedPairsForRecipe,
} from '@/lib/ingredient-pairs'
import { RECIPES_DATA } from '@/lib/recipes-data'

describe('Ingredient Pairs SEO Engine', () => {
  it('loads valid ingredient pairs with 5+ recipes each (anti-thin content guard)', () => {
    expect(INGREDIENT_PAIRS.length).toBeGreaterThan(50)
    for (const pair of INGREDIENT_PAIRS) {
      expect(pair.count).toBeGreaterThanOrEqual(5)
      expect(pair.recipeIds.length).toBeGreaterThanOrEqual(5)
      expect(pair.slug).toMatch(/^[a-z0-9_-]+-and-[a-z0-9_-]+$/)
      // Verify alphabetized keys: keyA comes before keyB
      expect(pair.keyA <= pair.keyB).toBe(true)
    }
  })

  it('matches recipes containing both ingredients accurately', () => {
    // Test the top pair: chicken-and-garlic
    const recipes = getRecipesForPair('chicken-and-garlic')
    expect(recipes.length).toBeGreaterThanOrEqual(5)

    for (const r of recipes) {
      const keys = r.ingredients.map((i) => i.standardKey?.toLowerCase())
      expect(keys).toContain('chicken')
      expect(keys).toContain('garlic')
    }
  })

  it('returns empty array for invalid or non-existent slug', () => {
    const recipes = getRecipesForPair('nonexistent-and-unicorn')
    expect(recipes).toEqual([])
  })

  it('extracts related pairs for a recipe for two-way internal linking', () => {
    // Find a recipe with chicken and garlic
    const chickenRecipe = RECIPES_DATA.find((r) =>
      r.ingredients.some((i) => i.standardKey === 'chicken') &&
      r.ingredients.some((i) => i.standardKey === 'garlic')
    )
    expect(chickenRecipe).toBeDefined()

    if (chickenRecipe) {
      const related = getRelatedPairsForRecipe(chickenRecipe, 3)
      expect(related.length).toBeGreaterThan(0)
      expect(related.length).toBeLessThanOrEqual(3)
      // chicken-and-garlic should be among the matches
      expect(related.some((p) => p.slug === 'chicken-and-garlic')).toBe(true)
    }
  })
})

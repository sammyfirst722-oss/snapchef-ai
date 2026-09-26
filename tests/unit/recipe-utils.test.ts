import { describe, it, expect } from 'vitest'
import { scaleIngredientAmount, getRecipeNutrition, NUTRITION_ESTIMATES } from '@/lib/recipe-utils'

describe('lib/recipe-utils.ts Unit Tests', () => {
  describe('scaleIngredientAmount', () => {
    describe('edge cases and unscaled inputs', () => {
      it('returns original string when multiplier is 1', () => {
        expect(scaleIngredientAmount('2 cups flour', 1)).toBe('2 cups flour')
        expect(scaleIngredientAmount('1/2 tsp salt', 1)).toBe('1/2 tsp salt')
      })

      it('handles empty, null, or undefined strings gracefully', () => {
        expect(scaleIngredientAmount('', 2)).toBe('')
        expect(scaleIngredientAmount(undefined as unknown as string, 2)).toBeUndefined()
      })

      it('ignores unmeasurable or qualitative amounts', () => {
        expect(scaleIngredientAmount('Salt to taste', 2)).toBe('Salt to taste')
        expect(scaleIngredientAmount('pinch of red pepper flakes', 2)).toBe('pinch of red pepper flakes')
        expect(scaleIngredientAmount('dash of hot sauce', 3)).toBe('dash of hot sauce')
        expect(scaleIngredientAmount('Parsley for garnish', 2)).toBe('Parsley for garnish')
        expect(scaleIngredientAmount('some chopped cilantro', 2)).toBe('some chopped cilantro')
      })

      it('returns original text if no numeric pattern matches', () => {
        expect(scaleIngredientAmount('Fresh basil leaves', 2)).toBe('Fresh basil leaves')
      })
    })

    describe('whole numbers', () => {
      it('scales whole numbers upwards', () => {
        expect(scaleIngredientAmount('2 cups rice', 2)).toBe('4 cups rice')
        expect(scaleIngredientAmount('1 onion', 3)).toBe('3 onion')
        expect(scaleIngredientAmount('3 cloves garlic', 2)).toBe('6 cloves garlic')
      })

      it('scales whole numbers downwards', () => {
        expect(scaleIngredientAmount('4 eggs', 0.5)).toBe('2 eggs')
        expect(scaleIngredientAmount('2 tbsp oil', 0.5)).toBe('1 tbsp oil')
      })
    })

    describe('fractions', () => {
      it('scales fractions that result in whole numbers', () => {
        expect(scaleIngredientAmount('1/2 tsp salt', 2)).toBe('1 tsp salt')
        expect(scaleIngredientAmount('1/4 cup sugar', 4)).toBe('1 cup sugar')
      })

      it('scales fractions that result in smaller fractions', () => {
        expect(scaleIngredientAmount('1/2 tsp salt', 0.5)).toBe('1/4 tsp salt')
      })

      it('scales fractions that result in other common fractions', () => {
        expect(scaleIngredientAmount('1/4 cup broth', 2)).toBe('1/2 cup broth')
        expect(scaleIngredientAmount('1/3 cup milk', 2)).toBe('2/3 cup milk')
        expect(scaleIngredientAmount('3/4 cup water', 2)).toBe('1 1/2 cup water')
      })

      it('scales fractions that result in mixed numbers', () => {
        expect(scaleIngredientAmount('2/3 cup flour', 2)).toBe('1 1/3 cup flour')
      })
    })

    describe('mixed numbers', () => {
      it('scales mixed numbers to whole numbers', () => {
        expect(scaleIngredientAmount('1 1/2 cups flour', 2)).toBe('3 cups flour')
        expect(scaleIngredientAmount('2 1/2 tbsp butter', 2)).toBe('5 tbsp butter')
      })

      it('scales mixed numbers to smaller fractions', () => {
        expect(scaleIngredientAmount('1 1/2 cups milk', 0.5)).toBe('3/4 cups milk')
      })

      it('scales mixed numbers to other mixed numbers', () => {
        expect(scaleIngredientAmount('1 1/4 cups sugar', 2)).toBe('2 1/2 cups sugar')
        expect(scaleIngredientAmount('1 1/3 cups oats', 2)).toBe('2 2/3 cups oats')
      })
    })

    describe('decimals', () => {
      it('scales decimal numbers correctly', () => {
        expect(scaleIngredientAmount('1.5 lbs chicken', 2)).toBe('3 lbs chicken')
        expect(scaleIngredientAmount('2.5 kg potatoes', 2)).toBe('5 kg potatoes')
      })
    })

    describe('ranges', () => {
      it('scales simple ranges like "2-3"', () => {
        expect(scaleIngredientAmount('2-3 cloves garlic', 2)).toBe('4-6 cloves garlic')
      })

      it('scales ranges with spaces like "1 - 2"', () => {
        expect(scaleIngredientAmount('1 - 2 tbsp olive oil', 2)).toBe('2-4 tbsp olive oil')
      })

      it('scales fraction ranges like "1/2 - 1"', () => {
        expect(scaleIngredientAmount('1/2 - 1 tsp black pepper', 2)).toBe('1-2 tsp black pepper')
      })
    })
  })

  describe('getRecipeNutrition', () => {
    const mockRecipe = {
      servings: 2,
      ingredients: [
        { name: 'Chicken breast', category: 'Proteins' },      // 200 cal, 25 pro, 0 carb, 10 fat
        { name: 'Broccoli', category: 'Produce' },              // 30 cal, 1 pro, 6 carb, 0 fat
        { name: 'Parmesan cheese', category: 'Dairy' },         // 100 cal, 6 pro, 4 carb, 8 fat
        { name: 'Brown rice', category: 'Pantry & Grains' },    // 150 cal, 4 pro, 30 carb, 2 fat
        { name: 'Black pepper', category: 'Spices & Sauces' },  // 20 cal, 0 pro, 2 carb, 1 fat
      ],
    }

    it('calculates single-serving nutrition based on recipe categories', () => {
      // Total raw values:
      // cal: 200 + 30 + 100 + 150 + 20 = 500
      // pro: 25 + 1 + 6 + 4 + 0 = 36
      // carb: 0 + 6 + 4 + 30 + 2 = 42
      // fat: 10 + 0 + 8 + 2 + 1 = 21
      // baseMulti = 1 / 2 = 0.5
      // Expected per serving: cal: 250, pro: 18, carb: 21, fat: 11 (21 * 0.5 = 10.5 -> 11)

      const nutrition = getRecipeNutrition(mockRecipe, 1)

      expect(nutrition).toEqual({
        cal: 250,
        pro: 18,
        carb: 21,
        fat: 11,
      })
    })

    it('scales nutrition linearly with multiplier', () => {
      // With multiplier 2 on a 2-serving recipe, baseMulti = 2 / 2 = 1.0 (entire dish)
      const nutrition = getRecipeNutrition(mockRecipe, 2)

      expect(nutrition).toEqual({
        cal: 500,
        pro: 36,
        carb: 42,
        fat: 21,
      })
    })

    it('falls back to Spices & Sauces for unknown or unclassified ingredient categories', () => {
      const mysteryRecipe = {
        servings: 1,
        ingredients: [
          { name: 'Secret Sauce', category: 'Unknown Category' },
        ],
      }

      const nutrition = getRecipeNutrition(mysteryRecipe, 1)
      const spiceEstimate = NUTRITION_ESTIMATES['Spices & Sauces']

      expect(nutrition.cal).toBe(spiceEstimate.cal)
      expect(nutrition.pro).toBe(spiceEstimate.pro)
      expect(nutrition.carb).toBe(spiceEstimate.carb)
      expect(nutrition.fat).toBe(spiceEstimate.fat)
    })
  })
})

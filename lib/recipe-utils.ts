export const NUTRITION_ESTIMATES: Record<string, { cal: number; pro: number; carb: number; fat: number }> = {
  Proteins: { cal: 200, pro: 25, carb: 0, fat: 10 },
  Produce: { cal: 30, pro: 1, carb: 6, fat: 0 },
  Dairy: { cal: 100, pro: 6, carb: 4, fat: 8 },
  'Pantry & Grains': { cal: 150, pro: 4, carb: 30, fat: 2 },
  'Spices & Sauces': { cal: 20, pro: 0, carb: 2, fat: 1 },
}

function parseFraction(str: string): number {
  if (str.includes('/')) {
    const parts = str.split('/')
    if (parts.length === 2) {
      return parseInt(parts[0]) / parseInt(parts[1])
    }
  }
  return parseFloat(str)
}

function parseMixed(str: string): number {
  const parts = str.trim().split(' ')
  let total = 0
  for (const p of parts) {
    if (!isNaN(parseFraction(p))) {
      total += parseFraction(p)
    }
  }
  return total || 1
}

function formatAmount(num: number): string {
  if (Math.abs(num - Math.round(num)) < 0.01) return Math.round(num).toString()
  const fractionMap = [
    { v: 0.25, s: '1/4' },
    { v: 0.33, s: '1/3' },
    { v: 0.5, s: '1/2' },
    { v: 0.66, s: '2/3' },
    { v: 0.75, s: '3/4' },
  ]
  const whole = Math.floor(num)
  const rem = num - whole
  for (const f of fractionMap) {
    if (Math.abs(rem - f.v) < 0.05) {
      return whole > 0 ? `${whole} ${f.s}` : f.s
    }
  }
  return num.toFixed(1).replace(/\.0$/, '')
}

export function scaleIngredientAmount(amount: string, multiplier: number): string {
  if (multiplier === 1) return amount
  if (!amount) return amount

  const ignore = ['taste', 'pinch', 'dash', 'garnish', 'some']
  if (ignore.some((w) => amount.toLowerCase().includes(w))) return amount

  // Matches ranges like "2-3", "2 - 3", "1/2 - 1" at the start
  // Order matters: mixed numbers (1 1/2), then fractions (1/2), then decimals/integers (2.5, 3)
  const numPattern = '(\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:\\.\\d+)?)'
  const rangeRegex = new RegExp(`^${numPattern}\\s*-\\s*${numPattern}`)
  const rangeMatch = amount.match(rangeRegex)
  if (rangeMatch) {
    const val1 = parseMixed(rangeMatch[1]) * multiplier
    const val2 = parseMixed(rangeMatch[2]) * multiplier
    const rest = amount.slice(rangeMatch[0].length)
    return `${formatAmount(val1)}-${formatAmount(val2)}${rest}`
  }

  // Matches patterns like "1 1/2", "1/2", "2.5", "3" at the start
  const regex = new RegExp(`^${numPattern}`)
  const match = amount.match(regex)
  
  if (match) {
    const numPart = match[1]
    const rest = amount.slice(numPart.length)
    const val = parseMixed(numPart) * multiplier
    return `${formatAmount(val)}${rest}`
  }
  
  return amount
}

export function getRecipeNutrition(recipe: any, multiplier: number = 1) {
  let cal = 0,
    pro = 0,
    carb = 0,
    fat = 0
  recipe.ingredients.forEach((ing: any) => {
    const est = NUTRITION_ESTIMATES[ing.category] || NUTRITION_ESTIMATES['Spices & Sauces']
    cal += est.cal
    pro += est.pro
    carb += est.carb
    fat += est.fat
  })
  
  // Per serving calculation based on estimates
  // Assuming recipe.ingredients represent the total recipe which yields recipe.servings
  const baseMulti = multiplier / recipe.servings
  
  return {
    cal: Math.round(cal * baseMulti),
    pro: Math.round(pro * baseMulti),
    carb: Math.round(carb * baseMulti),
    fat: Math.round(fat * baseMulti),
  }
}

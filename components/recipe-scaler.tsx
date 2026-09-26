'use client'

import React, { useState } from 'react'
import { Ingredient, INGREDIENT_CATEGORY_COLORS } from '@/lib/recipes-data'
import { scaleIngredientAmount, NUTRITION_ESTIMATES } from '@/lib/recipe-utils'
import { Users, CheckCircle2, Circle } from 'lucide-react'

interface RecipeScalerProps {
  baseServings: number
  ingredients: Ingredient[]
  instructions: string[]
}

export function RecipeScaler({ baseServings, ingredients, instructions }: RecipeScalerProps) {
  const [servings, setServings] = useState<number>(baseServings)
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({})

  const multiplier = servings / (baseServings || 1)

  // Calculate nutrition estimate scaled to servings
  const nutrition = ingredients.reduce(
    (acc, ing) => {
      const est = NUTRITION_ESTIMATES[ing.category] || { cal: 50, pro: 2, carb: 5, fat: 1 }
      return {
        cal: acc.cal + est.cal,
        pro: acc.pro + est.pro,
        carb: acc.carb + est.carb,
        fat: acc.fat + est.fat,
      }
    },
    { cal: 0, pro: 0, carb: 0, fat: 0 }
  )

  const perServing = {
    cal: Math.round(nutrition.cal / (baseServings || 1)),
    pro: Math.round(nutrition.pro / (baseServings || 1)),
    carb: Math.round(nutrition.carb / (baseServings || 1)),
    fat: Math.round(nutrition.fat / (baseServings || 1)),
  }

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <div className="space-y-8">
      {/* Serving Scaler Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold text-gray-900 dark:text-white">Serving Size:</span>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 4, 6, 8].map((s) => (
            <button
              key={s}
              onClick={() => setServings(s)}
              className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
                servings === s
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-500/10'
              }`}
            >
              {s} {s === 1 ? 'person' : 'people'}
            </button>
          ))}
        </div>
      </div>

      {/* Nutrition Badges */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
          <div className="text-xl font-black text-gray-900 dark:text-white">{perServing.cal}</div>
          <div className="text-xs font-semibold text-gray-500">Calories</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{perServing.pro}g</div>
          <div className="text-xs font-semibold text-gray-500">Protein</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
          <div className="text-xl font-black text-blue-600 dark:text-blue-400">{perServing.carb}g</div>
          <div className="text-xs font-semibold text-gray-500">Carbs</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
          <div className="text-xl font-black text-amber-600 dark:text-amber-400">{perServing.fat}g</div>
          <div className="text-xs font-semibold text-gray-500">Fat</div>
        </div>
      </div>

      {/* Ingredients List */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Ingredients</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {ingredients.map((ing, idx) => {
            const scaledAmount = scaleIngredientAmount(ing.amount, multiplier)
            const colorClass = INGREDIENT_CATEGORY_COLORS[ing.category] || 'bg-gray-100 text-gray-700'
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md ${colorClass}`}>
                    {ing.category}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{ing.item}</span>
                </div>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                  {scaledAmount}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Instructions */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Step-by-Step Instructions</h2>
        <div className="space-y-3">
          {instructions.map((step, idx) => {
            const isDone = completedSteps[idx]
            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                  isDone
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-gray-400 dark:text-gray-500 line-through'
                    : 'bg-white dark:bg-gray-800/80 border-gray-100 dark:border-gray-700 hover:border-emerald-500/30 shadow-sm'
                }`}
              >
                <button type="button" className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 text-gray-400" />}
                </button>
                <div className="flex-1 text-sm sm:text-base leading-relaxed">
                  <span className="font-bold mr-2 text-emerald-700 dark:text-emerald-400">
                    Step {idx + 1}:
                  </span>
                  {step}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import { ShoppingBag, ExternalLink } from 'lucide-react'

interface GroceryAffiliateProps {
  ingredients: Array<{ item: string; amount: string }>
  recipeTitle: string
}

export function GroceryAffiliate({ ingredients, recipeTitle }: GroceryAffiliateProps) {
  const topItems = ingredients.slice(0, 5).map((i) => i.item).join(', ')
  const instacartUrl = `https://www.instacart.com/store/search?k=${encodeURIComponent(topItems || recipeTitle)}`
  const walmartUrl = `https://www.walmart.com/search?q=${encodeURIComponent(topItems || recipeTitle)}`
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(topItems || recipeTitle)}&i=grocery`

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 border border-amber-500/20 text-gray-900 dark:text-gray-100 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span className="font-bold text-sm">Need Ingredients Delivered?</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
          1-Click Shopping
        </span>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400">
        Missing items for {recipeTitle}? Get ingredients delivered to your door in as little as 1 hour:
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        <a
          href={instacartUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-transform active:scale-95 shadow-sm"
        >
          <span>Instacart</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <a
          href={walmartUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-transform active:scale-95 shadow-sm"
        >
          <span>Walmart Fresh</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-transform active:scale-95 shadow-sm"
        >
          <span>Amazon Fresh</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}

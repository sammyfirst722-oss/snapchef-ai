'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Recipe } from '@/lib/recipes-data'
import { Search, Clock, ChefHat, Sparkles, Camera } from 'lucide-react'

interface RecipesDirectoryProps {
  initialRecipes: Recipe[]
}

export function RecipesDirectory({ initialRecipes }: RecipesDirectoryProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = useMemo(() => {
    const set = new Set<string>()
    initialRecipes.forEach((r) => {
      if (r.category) set.add(r.category)
    })
    return ['All', ...Array.from(set)]
  }, [initialRecipes])

  const filteredRecipes = useMemo(() => {
    return initialRecipes.filter((r) => {
      const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory
      const query = search.toLowerCase()
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.ingredients.some((ing) => ing.item.toLowerCase().includes(query)) ||
        r.tags.some((tag) => tag.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  }, [initialRecipes, selectedCategory, search])

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Bar */}
      <div className="space-y-4">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ingredient (chicken, eggs, spinach) or meal name..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-emerald-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipe/${recipe.id}`}
            className="group flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-200"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  {recipe.category}
                </span>
                <span>{recipe.difficulty}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1">
                {recipe.title}
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-medium text-gray-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
                <span>{recipe.ingredients.length} items</span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                View Recipe →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <p className="text-gray-500 font-medium">No recipes found matching your search.</p>
          <button
            onClick={() => {
              setSearch('')
              setSelectedCategory('All')
            }}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

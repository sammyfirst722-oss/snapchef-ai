'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Recipe } from '@/lib/recipes-data'
import { IngredientPair } from '@/lib/ingredient-pairs-data'
import {
  Clock,
  ChefHat,
  Sparkles,
  Camera,
  ArrowRight,
  Search,
  Filter,
  UtensilsCrossed,
} from 'lucide-react'

interface IngredientPairDirectoryProps {
  pair: IngredientPair
  recipes: Recipe[]
  relatedPairs: IngredientPair[]
}

export function IngredientPairDirectory({
  pair,
  recipes,
  relatedPairs,
}: IngredientPairDirectoryProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [page, setPage] = useState(1)
  const pageSize = 12

  // Categories present in this pair
  const categories = ['All', ...new Set(recipes.map((r) => r.category))]

  // Filter recipes
  const filtered = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || r.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Separate first 3 recipes (for early placement before the CTA)
  const firstThree = filtered.slice(0, 3)
  const remaining = filtered.slice(3)

  // Paginated remaining recipes
  const paginatedRemaining = remaining.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(remaining.length / pageSize)

  return (
    <div className="space-y-10">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${pair.nameA} & ${pair.nameB} recipes...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-gray-400 mr-1 hidden sm:block shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat)
                setPage(1)
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Recipes Section */}
      {firstThree.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
              Featured {pair.nameA} & {pair.nameB} Dishes
            </h2>
            <span className="text-xs font-bold text-gray-500">
              Showing {filtered.length} meals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {firstThree.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-3">
          <p className="text-gray-500 text-sm">
            No recipes matched your search or category filter.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setSelectedCategory('All')
            }}
            className="text-xs font-bold text-emerald-600 underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* High-Converting Fridge Scan CTA Banner (Above the Fold after Recipe 3) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white shadow-xl shadow-emerald-950/20 space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:space-y-0 gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-emerald-100">
            <Camera className="w-3.5 h-3.5" />
            Instant Fridge Scanner
          </div>
          <h3 className="text-2xl sm:text-3xl font-black leading-tight">
            Got {pair.nameA} & {pair.nameB} but missing the rest?
          </h3>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Snap a photo of your fridge or pantry right now. SnapChef AI will automatically find recipes using ingredients you already have at home — zero grocery store trips.
          </p>
        </div>

        <div className="shrink-0 pt-2 sm:pt-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white text-emerald-900 font-black text-sm sm:text-base hover:bg-emerald-50 transition-transform active:scale-95 shadow-lg w-full sm:w-auto justify-center"
          >
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Snap My Fridge Free
          </Link>
        </div>
      </div>

      {/* Remaining Recipes Grid */}
      {paginatedRemaining.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            More {pair.nameA} & {pair.nameB} Recipes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedRemaining.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-gray-500 px-2">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Related Ingredient Combinations (Two-Way Internal Linking Hub) */}
      {relatedPairs.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">
            Popular Related Ingredient Combinations
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {relatedPairs.map((rel) => (
              <Link
                key={rel.slug}
                href={`/recipes-with/${rel.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
              >
                <span>{rel.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                  {rel.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all group">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            {recipe.category}
          </span>
          <span className="text-gray-400">{recipe.difficulty}</span>
        </div>

        <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1">
          {recipe.title}
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        <div className="flex items-center gap-3 pt-2 text-[11px] font-medium text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
            <span>{recipe.servings} serv</span>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
        <Link
          href={`/recipe/${recipe.id}`}
          className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 hover:text-emerald-700 group-hover:translate-x-0.5 transition-all"
        >
          View Recipe
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

import { Metadata } from 'next'
import Link from 'next/link'
import { RECIPES_DATA } from '@/lib/recipes-data'
import { RecipesDirectory } from '@/components/recipes-directory'
import { Camera, Sparkles, Utensils } from 'lucide-react'

export const metadata: Metadata = {
  title: '500+ Easy Recipes for Leftovers & Quick Dinners | SnapChef AI',
  description:
    'Browse 500+ quick, tested recipes for breakfast, lunch, and dinner. Scalable servings, step-by-step instructions, and instant fridge ingredient matching with AI camera vision.',
  openGraph: {
    title: '500+ Easy Recipes for Leftovers & Quick Dinners | SnapChef AI',
    description:
      'Browse 500+ tested recipes for any meal. Scale servings, check nutrition, or snap a photo of your fridge to find recipes with what you have.',
  },
  alternates: {
    canonical: 'https://snapchef-ai-eight.vercel.app/recipes',
  },
}

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-black text-emerald-600 dark:text-emerald-400"
          >
            <Utensils className="w-5 h-5" />
            SnapChef AI
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            Scan My Fridge
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-10 space-y-10">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            500+ Tested Recipes
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Delicious Meals From Ingredients You Already Have
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Search our curated library of 15-minute meals, comfort classics, and healthy dinners. Don't want to browse? Use our AI camera to scan your fridge directly.
          </p>
        </div>

        {/* Directory Grid */}
        <RecipesDirectory initialRecipes={RECIPES_DATA} />

        {/* Bottom Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white text-center space-y-4 shadow-xl shadow-emerald-950/20">
          <h2 className="text-2xl sm:text-3xl font-black">Ready to Cook Right Now?</h2>
          <p className="max-w-lg mx-auto text-emerald-100 text-sm sm:text-base">
            SnapChef AI detects what is in your fridge and pantry in seconds, giving you custom recipes without grocery trips.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-emerald-900 font-black text-sm hover:bg-emerald-50 transition-transform active:scale-95 shadow-md"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              Try AI Fridge Scanner Free
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

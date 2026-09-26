import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RECIPES_DATA } from '@/lib/recipes-data'
import { RecipeScaler } from '@/components/recipe-scaler'
import { ArrowLeft, Clock, ChefHat, Sparkles, Camera } from 'lucide-react'

interface RecipePageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return RECIPES_DATA.map((recipe) => ({
    id: recipe.id,
  }))
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { id } = await params
  const recipe = RECIPES_DATA.find((r) => r.id === id)

  if (!recipe) {
    return {
      title: 'Recipe Not Found | SnapChef AI',
    }
  }

  const ingredientNames = recipe.ingredients.map((i) => i.item).join(', ')

  return {
    title: `${recipe.title} - Easy ${recipe.prepTime} Recipe | SnapChef AI`,
    description: `${recipe.description} Made with ${ingredientNames}. Ready in ${recipe.cookTime}.`,
    openGraph: {
      title: `${recipe.title} | SnapChef AI`,
      description: recipe.description,
      images: [recipe.imageUrl || '/icons/icon-512.png'],
    },
    alternates: {
      canonical: `https://snapchef-ai-eight.vercel.app/recipe/${recipe.id}`,
    },
  }
}

export default async function RecipeDetailPage({ params }: RecipePageProps) {
  const { id } = await params
  const recipe = RECIPES_DATA.find((r) => r.id === id)

  if (!recipe) {
    notFound()
  }

  // JSON-LD structured data for Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: [recipe.imageUrl || 'https://snapchef-ai-eight.vercel.app/icons/icon-512.png'],
    prepTime: `PT${recipe.prepTime.replace(/\D/g, '')}M`,
    cookTime: `PT${recipe.cookTime.replace(/\D/g, '')}M`,
    recipeYield: `${recipe.servings} servings`,
    recipeCategory: recipe.category,
    keywords: recipe.tags.join(', '),
    recipeIngredient: recipe.ingredients.map((i) => `${i.amount} ${i.item}`),
    recipeInstructions: recipe.instructions.map((step, idx) => ({
      '@type': 'HowToStep',
      name: `Step ${idx + 1}`,
      text: step,
      position: idx + 1,
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-20">
      {/* Schema.org Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/recipes"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Recipes
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            Scan My Fridge
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        {/* Recipe Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              {recipe.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {recipe.difficulty}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {recipe.title}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            {recipe.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100 dark:border-gray-800 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Prep: {recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-emerald-600" />
              <span>Cook: {recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Serves: {recipe.servings}</span>
            </div>
          </div>
        </div>

        {/* Interactive Scaler & Ingredients / Steps */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <RecipeScaler
            baseServings={recipe.servings}
            ingredients={recipe.ingredients}
            instructions={recipe.instructions}
          />
        </div>

        {/* High-Converting Fridge Scanner CTA */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-xl shadow-emerald-950/20 text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Have Different Ingredients In Your Fridge?
          </h2>
          <p className="max-w-xl mx-auto text-emerald-100 text-sm sm:text-base leading-relaxed">
            Don't run to the grocery store. Snap a photo of your fridge or pantry with SnapChef AI, and our vision engine will create a custom recipe using only what you have on hand.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-emerald-900 font-black text-sm sm:text-base hover:bg-emerald-50 transition-transform active:scale-95 shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Snap My Fridge Now (Free Scan)
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

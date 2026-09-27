import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  INGREDIENT_PAIRS,
  INGREDIENT_PAIRS_MAP,
  getRecipesForPair,
} from '@/lib/ingredient-pairs'
import { IngredientPairDirectory } from '@/components/ingredient-pair-directory'
import { ArrowLeft, Sparkles, Camera, Utensils } from 'lucide-react'

interface PairPageProps {
  params: Promise<{ pair: string }>
}

export async function generateStaticParams() {
  return INGREDIENT_PAIRS.map((p) => ({
    pair: p.slug,
  }))
}

export async function generateMetadata({ params }: PairPageProps): Promise<Metadata> {
  const { pair: slug } = await params
  const pair = INGREDIENT_PAIRS_MAP[slug?.toLowerCase()?.trim()]

  if (!pair) {
    return {
      title: 'Recipes Not Found | SnapChef AI',
    }
  }

  const title = `Best Recipes with ${pair.nameA} and ${pair.nameB} (${pair.count} Tested Meals) | SnapChef AI`
  const description = `Looking for dinners with ${pair.nameA.toLowerCase()} and ${pair.nameB.toLowerCase()}? Browse ${pair.count} easy recipes, fast prep meals, or snap a photo of your fridge to get custom AI recipes.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ['/icons/icon-512.png'],
    },
    alternates: {
      canonical: `https://snapchef-ai-eight.vercel.app/recipes-with/${pair.slug}`,
    },
  }
}

export default async function IngredientPairPage({ params }: PairPageProps) {
  const { pair: slug } = await params
  const pair = INGREDIENT_PAIRS_MAP[slug?.toLowerCase()?.trim()]

  if (!pair) {
    notFound()
  }

  const recipes = getRecipesForPair(pair.slug)

  // Top related pairs that share one of the ingredients
  const relatedPairs = INGREDIENT_PAIRS.filter(
    (p) =>
      p.slug !== pair.slug &&
      (p.keyA === pair.keyA ||
        p.keyB === pair.keyA ||
        p.keyA === pair.keyB ||
        p.keyB === pair.keyB)
  ).slice(0, 8)

  // Schema.org CollectionPage & ItemList with Breadcrumbs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://snapchef-ai-eight.vercel.app',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'All Recipes',
            item: 'https://snapchef-ai-eight.vercel.app/recipes',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `Recipes with ${pair.title}`,
            item: `https://snapchef-ai-eight.vercel.app/recipes-with/${pair.slug}`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: `Best Recipes with ${pair.nameA} and ${pair.nameB}`,
        description: `Curated collection of ${recipes.length} tested meals containing ${pair.nameA} and ${pair.nameB}.`,
        url: `https://snapchef-ai-eight.vercel.app/recipes-with/${pair.slug}`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: recipes.slice(0, 10).map((recipe, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: recipe.title,
            url: `https://snapchef-ai-eight.vercel.app/recipe/${recipe.id}`,
          })),
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-20">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/recipes"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Recipes
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

      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Breadcrumb nav */}
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Link href="/" className="hover:text-emerald-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/recipes" className="hover:text-emerald-600">
              Recipes
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-bold">
              {pair.title}
            </span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
            <Utensils className="w-3.5 h-3.5 text-emerald-600" />
            <span>{pair.count} Tested Recipes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Recipes with {pair.nameA} & {pair.nameB}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-base max-w-2xl leading-relaxed">
            Wondering what to make with {pair.nameA.toLowerCase()} and {pair.nameB.toLowerCase()}? Explore quick 15-minute skillet meals, hearty dinners, and family favorites below — or snap a photo of your fridge to match your exact pantry.
          </p>
        </div>
      </div>

      {/* Main Directory & Grid */}
      <main className="max-w-5xl mx-auto px-4 pt-8">
        <IngredientPairDirectory
          pair={pair}
          recipes={recipes}
          relatedPairs={relatedPairs}
        />
      </main>
    </div>
  )
}

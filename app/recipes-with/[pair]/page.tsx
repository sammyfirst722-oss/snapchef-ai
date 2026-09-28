import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import fs from 'node:fs'
import path from 'node:path'
import {
  INGREDIENT_PAIRS,
  INGREDIENT_PAIRS_MAP,
  getRecipesForPair,
} from '@/lib/ingredient-pairs'
import { IngredientPairDirectory } from '@/components/ingredient-pair-directory'
import {
  ArrowLeft,
  Sparkles,
  Camera,
  Utensils,
  ChefHat,
  HeartPulse,
  HelpCircle,
  CheckCircle2,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react'

interface PairPageProps {
  params: Promise<{ pair: string }>
}

interface IngredientGuide {
  pair: string
  title: string
  flavorProfile: string
  nutritionalSynergy: string
  prepTechniques: string[]
  faq: Array<{ q: string; a: string }>
}

function getIngredientGuide(slug: string): IngredientGuide | null {
  try {
    const filePath = path.join(process.cwd(), 'data', 'ingredient-guides', `${slug}.json`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(raw) as IngredientGuide
    }
  } catch {
    // Graceful fallback if file read fails
  }
  return null
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

  const guide = getIngredientGuide(pair.slug)
  const title = `Best Recipes with ${pair.nameA} and ${pair.nameB} (${pair.count} Tested Meals) | SnapChef AI`
  const description = guide
    ? `${guide.title}. Explore ${pair.count} easy tested meals, flavor science, nutritional synergy, and 1-click grocery delivery.`
    : `Looking for dinners with ${pair.nameA.toLowerCase()} and ${pair.nameB.toLowerCase()}? Browse ${pair.count} easy recipes, fast prep meals, or snap a photo of your fridge to get custom AI recipes.`

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
  const guide = getIngredientGuide(pair.slug)

  // Top related pairs that share one of the ingredients
  const relatedPairs = INGREDIENT_PAIRS.filter(
    (p) =>
      p.slug !== pair.slug &&
      (p.keyA === pair.keyA ||
        p.keyB === pair.keyA ||
        p.keyA === pair.keyB ||
        p.keyB === pair.keyB)
  ).slice(0, 8)

  // Affiliate shopping URLs for this pair
  const searchTerms = `${pair.nameA}, ${pair.nameB}`
  const instacartUrl = `https://www.instacart.com/store/search?k=${encodeURIComponent(searchTerms)}`
  const walmartUrl = `https://www.walmart.com/search?q=${encodeURIComponent(`${pair.nameA} ${pair.nameB}`)}`
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(`${pair.nameA} ${pair.nameB}`)}&i=grocery`

  // Schema.org CollectionPage & ItemList with Breadcrumbs
  const graphElements: any[] = [
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
  ]

  // Add FAQPage Schema if rich guide exists
  if (guide && guide.faq && guide.faq.length > 0) {
    graphElements.push({
      '@type': 'FAQPage',
      mainEntity: guide.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    })
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': graphElements,
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

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
              <Utensils className="w-3.5 h-3.5 text-emerald-600" />
              <span>{pair.count} Tested Recipes</span>
            </div>
            {guide && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Culinary &amp; Nutrition Guide Included</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Recipes with {pair.nameA} &amp; {pair.nameB}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-base max-w-2xl leading-relaxed">
            Wondering what to make with {pair.nameA.toLowerCase()} and {pair.nameB.toLowerCase()}? Explore quick 15-minute skillet meals, hearty dinners, and family favorites below &mdash; or snap a photo of your fridge to match your exact pantry.
          </p>

          {/* 1-Click Grocery Cart Affiliate Block */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                Get {pair.nameA} &amp; {pair.nameB} Delivered:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={instacartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold inline-flex items-center gap-1 transition-transform active:scale-95"
                >
                  Instacart <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={walmartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-1 transition-transform active:scale-95"
                >
                  Walmart Fresh <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold inline-flex items-center gap-1 transition-transform active:scale-95"
                >
                  Amazon Fresh <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Directory & Grid */}
      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-12">
        <IngredientPairDirectory
          pair={pair}
          recipes={recipes}
          relatedPairs={relatedPairs}
        />

        {/* =================================================================== */}
        {/* RICH CULINARY SCIENCE & NUTRITION GUIDE (FROM WORKER FLEET)       */}
        {/* =================================================================== */}
        {guide && (
          <section className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="space-y-2 border-b border-gray-100 dark:border-gray-800 pb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
                Chef &amp; Nutritionist Analysis
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {guide.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Flavor Profile */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Flavor Synergy &amp; Aroma</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {guide.flavorProfile}
                </p>
              </div>

              {/* Nutritional Synergy */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  <HeartPulse className="w-4 h-4" />
                  <span>Nutritional &amp; Micronutrient Synergy</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {guide.nutritionalSynergy}
                </p>
              </div>
            </div>

            {/* Preparation Techniques */}
            {guide.prepTechniques && guide.prepTechniques.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  <span>Chef Prep Techniques for Best Results</span>
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {guide.prepTechniques.map((technique, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{technique}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Frequently Asked Questions */}
            {guide.faq && guide.faq.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span>Frequently Asked Cooking Questions</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guide.faq.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-750 space-y-2"
                    >
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                        {item.q}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

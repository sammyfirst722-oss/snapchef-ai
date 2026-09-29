'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { RECIPES_DATA, Recipe, INGREDIENT_CATEGORY_COLORS } from '@/lib/recipes-data'
import {
  getFavoriteRecipeIds,
  toggleFavoriteRecipe,
  getLikedRecipeIds,
  toggleLikeRecipe,
} from '@/lib/recipes-store'
import {
  getFridgeItems,
  toggleFridgeItem,
  clearFridgeItems,
  addFridgeItems,
  isUserPro,
  setUserPro,
  setUserEmail,
  getUserEmail,
  restoreProByEmail,
} from '@/lib/fridge-store'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Camera,
  ChefHat,
  Search,
  Sparkles,
  Clock,
  Users,
  Flame,
  Plus,
  X,
  Check,
  Star,
  Heart,
  Copy,
  Zap,
  Moon,
  Sun,
  UtensilsCrossed,
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { CameraScanner } from '@/components/camera-scanner'
import { AiLeftoverGenerator } from '@/components/ai-leftover-generator'
import { ProUpgradeModal } from '@/components/pro-upgrade-modal'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { scaleIngredientAmount, getRecipeNutrition, calculateRecipeMatch } from '@/lib/recipe-utils'
import { CookMode } from '@/components/cook-mode'
import { speechManager, SPEECH_RATES, SpeechRate } from '@/lib/speech-utils'
import {
  Language,
  UI_TRANSLATIONS,
  translateIngredientName,
  translateInstructionStep,
} from '@/lib/translations/spanish'

const QUICK_STAPLES = [
  { name: 'Eggs', key: 'egg', icon: '🥚' },
  { name: 'Chicken', key: 'chicken', icon: '🍗' },
  { name: 'Cheese', key: 'cheese', icon: '🧀' },
  { name: 'Garlic', key: 'garlic', icon: '🧄' },
  { name: 'Butter', key: 'butter', icon: '🧈' },
  { name: 'Pasta', key: 'pasta', icon: '🍝' },
  { name: 'Rice', key: 'rice', icon: '🍚' },
  { name: 'Ground Beef', key: 'ground beef', icon: '🥩' },
  { name: 'Bacon', key: 'bacon', icon: '🥓' },
  { name: 'Tomato', key: 'tomato', icon: '🍅' },
  { name: 'Spinach', key: 'spinach', icon: '🥬' },
  { name: 'Milk', key: 'milk', icon: '🥛' },
]

const MEAL_CATEGORIES = [
  'All Meals',
  'Favorites',
  '15-Min Meals',
  'Dinner',
  'Breakfast',
  'Pasta',
  'One-Pot',
  'Soups & Salads',
  'Snacks & Quick Bites',
]

export function SnapChefClient() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Meals')
  const [fridgeItems, setFridgeItems] = useState<string[]>([])
  const [customItemInput, setCustomItemInput] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [copied, setCopied] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [likeDeltas, setLikeDeltas] = useState<Record<string, number>>({})
  const [proModalOpen, setProModalOpen] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [servingMultiplier, setServingMultiplier] = useState(1)
  const [isCooking, setIsCooking] = useState(false)
  const [recipeLanguage, setRecipeLanguage] = useState<Language>('en')
  const [recipeSpeechRate, setRecipeSpeechRate] = useState<SpeechRate>(1.0)
  const [isRecipeSpeaking, setIsRecipeSpeaking] = useState(false)
  const [recipeSpeakingStep, setRecipeSpeakingStep] = useState<number | null>(null)

  const stopRecipeSpeech = () => {
    speechManager.stop()
    setIsRecipeSpeaking(false)
    setRecipeSpeakingStep(null)
  }

  const playRecipeSteps = (startIdx = 0, lang = recipeLanguage, rate = recipeSpeechRate) => {
    if (!selectedRecipe || startIdx >= selectedRecipe.instructions.length) {
      setIsRecipeSpeaking(false)
      setRecipeSpeakingStep(null)
      return
    }

    setRecipeSpeakingStep(startIdx)
    setIsRecipeSpeaking(true)

    const raw = selectedRecipe.instructions[startIdx]
    const textToSpeak = lang === 'es' ? translateInstructionStep(raw, 'es') : raw
    const stepPrefix = lang === 'es' ? `Paso ${startIdx + 1}. ` : `Step ${startIdx + 1}. `

    speechManager.speak(`${stepPrefix}${textToSpeak}`, {
      lang,
      rate,
      onStart: () => {
        setIsRecipeSpeaking(true)
        setRecipeSpeakingStep(startIdx)
      },
      onEnd: () => {
        if (selectedRecipe && startIdx + 1 < selectedRecipe.instructions.length) {
          playRecipeSteps(startIdx + 1, lang, rate)
        } else {
          setIsRecipeSpeaking(false)
          setRecipeSpeakingStep(null)
        }
      },
      onError: () => {
        setIsRecipeSpeaking(false)
        setRecipeSpeakingStep(null)
      },
    })
  }

  const toggleRecipeAudio = () => {
    if (isRecipeSpeaking) {
      stopRecipeSpeech()
    } else {
      playRecipeSteps(0)
    }
  }

  const handleRecipeSpeedChange = (rate: SpeechRate) => {
    setRecipeSpeechRate(rate)
    if (isRecipeSpeaking && recipeSpeakingStep !== null) {
      playRecipeSteps(recipeSpeakingStep, recipeLanguage, rate)
    }
  }

  const handleRecipeLanguageToggle = (lang: Language) => {
    setRecipeLanguage(lang)
    if (isRecipeSpeaking && recipeSpeakingStep !== null) {
      playRecipeSteps(recipeSpeakingStep, lang, recipeSpeechRate)
    }
  }

  const scannerRef = useRef<HTMLDivElement>(null)
  const recipesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    setFridgeItems(getFridgeItems())
    setFavoriteIds(getFavoriteRecipeIds())
    setLikedIds(getLikedRecipeIds())
    setIsPro(isUserPro())

    const handleFridgeUpdate = () => setFridgeItems(getFridgeItems())
    const handleFavChange = () => setFavoriteIds(getFavoriteRecipeIds())
    const handleLikeChange = () => setLikedIds(getLikedRecipeIds())
    const handleProChange = () => setIsPro(isUserPro())

    // Check for Stripe payment redirect (?email=..., ?upgraded=true)
    try {
      if (typeof window !== 'undefined' && window.location.search) {
        const params = new URLSearchParams(window.location.search)
        const isUpgraded = params.get('upgraded') === 'true'
        const emailParam = params.get('email')?.toLowerCase().trim()

        if (isUpgraded) {
          const emailToSave = emailParam || ''
          if (emailToSave) setUserEmail(emailToSave)
          setUserPro(true)
          setIsPro(true)
          toast.success('SnapChef Pro Activated! ⭐', {
            description: `Unlimited AI camera fridge scans unlocked.`,
          })

          // Clean URL without reloading page
          const cleanUrl = new URL(window.location.href)
          cleanUrl.searchParams.delete('email')
          cleanUrl.searchParams.delete('upgraded')
          window.history.replaceState({}, '', cleanUrl.pathname + (cleanUrl.search || ''))
        }
      }
    } catch (err) {
      console.warn('Payment param check error:', err)
    }

    window.addEventListener('snapchef_fridge_changed', handleFridgeUpdate)
    window.addEventListener('pb_recipe_favorites_changed', handleFavChange)
    window.addEventListener('pb_recipe_likes_changed', handleLikeChange)
    window.addEventListener('snapchef_pro_changed', handleProChange)

    return () => {
      window.removeEventListener('snapchef_fridge_changed', handleFridgeUpdate)
      window.removeEventListener('pb_recipe_favorites_changed', handleFavChange)
      window.removeEventListener('pb_recipe_likes_changed', handleLikeChange)
      window.removeEventListener('snapchef_pro_changed', handleProChange)
    }
  }, [])

  const handleToggleFavorite = (recipeId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const isFav = toggleFavoriteRecipe(recipeId)
    setFavoriteIds(getFavoriteRecipeIds())
    toast(isFav ? 'Saved to favorites! ⭐' : 'Removed from favorites')
  }

  const handleToggleLike = (recipeId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const { isLiked, delta } = toggleLikeRecipe(recipeId)
    setLikedIds(getLikedRecipeIds())
    setLikeDeltas((prev) => ({
      ...prev,
      [recipeId]: (prev[recipeId] || 0) + delta,
    }))
    if (isLiked) {
      toast.success('Liked this meal! ❤️')
    }
  }

  const handleAddCustomStaple = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = customItemInput.trim().toLowerCase()
    if (!clean) return
    addFridgeItems([clean])
    setCustomItemInput('')
    toast.success(`Added ${clean} to your fridge`)
  }

  const copyRecipe = async (recipe: Recipe) => {
    const text = `${recipe.title} (${recipe.category})\nPrep: ${recipe.prepTime} | Cook: ${recipe.cookTime} | Servings: ${recipe.servings}\n\nINGREDIENTS:\n${recipe.ingredients
      .map((i) => `• ${i.item} (${i.amount}) [${i.category}]`)
      .join('\n')}\n\nINSTRUCTIONS:\n${recipe.instructions
      .map((step, idx) => `${idx + 1}. ${step}`)
      .join('\n')}`

    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Recipe copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  // Filter and score recipes
  const processedRecipes = useMemo(() => {
    return RECIPES_DATA.map((recipe) => {
      const match = calculateRecipeMatch(recipe.ingredients, fridgeItems, true)

      return {
        ...recipe,
        matchedCount: match.matchedCount,
        totalRequired: match.totalRequired,
        nonStapleRequired: match.nonStapleRequired,
        nonStapleMatched: match.nonStapleMatched,
        stapleCount: match.stapleCount,
        matchScore: match.matchScore,
        isCompleteMatch: match.isCompleteMatch,
        isAlmostMatch: match.isAlmostMatch,
        matchedIngredients: match.matchedIngredients,
        missingIngredients: match.missingIngredients,
      }
    })
      .filter((recipe) => {
        if (selectedCategory === 'Favorites') {
          if (!favoriteIds.includes(recipe.id)) return false
        } else if (selectedCategory !== 'All Meals' && recipe.category !== selectedCategory) {
          return false
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchesTitle = recipe.title.toLowerCase().includes(q)
          const matchesDesc = recipe.description.toLowerCase().includes(q)
          const matchesIng = recipe.ingredients.some((ing) =>
            ing.item.toLowerCase().includes(q)
          )
          if (!matchesTitle && !matchesDesc && !matchesIng) return false
        }

        return true
      })
      .sort((a, b) => {
        // Show complete matches first, then highest percentage match
        if (a.isCompleteMatch && !b.isCompleteMatch) return -1
        if (!a.isCompleteMatch && b.isCompleteMatch) return 1
        if (a.isAlmostMatch && !b.isAlmostMatch) return -1
        if (!a.isAlmostMatch && b.isAlmostMatch) return 1
        return b.matchScore - a.matchScore
      })
  }, [fridgeItems, selectedCategory, searchQuery, favoriteIds])

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-background text-foreground">
      {/* =================================================================== */}
      {/* APP TOP NAVIGATION HEADER                                          */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <ChefHat className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-lg tracking-tight text-foreground">
                  SnapChef
                </span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  AI
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Pro Upgrade / Badge Button */}
            {isPro ? (
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <Zap className="h-3 w-3 fill-emerald-600" />
                Pro
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setProModalOpen(true)}
                className="text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 h-8"
              >
                Upgrade
              </Button>
            )}

            {/* Dark / Light Mode Toggle */}
            {mounted && (
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* MAIN CONTAINER                                                     */}
      {/* =================================================================== */}
      <main className="container max-w-screen-xl mx-auto px-4 py-5 md:py-8 space-y-6">
        {/* 1. Camera Scanner Section */}
        <div ref={scannerRef}>
          <CameraScanner
            onIngredientsAdded={() => {
              setFridgeItems(getFridgeItems())
              recipesRef.current?.scrollIntoView({ behavior: 'smooth' })
            }}
            onOpenProModal={() => setProModalOpen(true)}
          />
        </div>

        {/* 2. Active Fridge Inventory */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">In Your Fridge ({fridgeItems.length})</h3>
            {fridgeItems.length > 0 && (
              <div className="flex items-center gap-2">
                <AiLeftoverGenerator
                  buttonVariant="inline"
                  onCookRecipe={(recipe) => {
                    setSelectedRecipe(recipe)
                    setIsCooking(true)
                  }}
                  onOpenProModal={() => setProModalOpen(true)}
                />
                <button
                  onClick={() => {
                    clearFridgeItems()
                    setFridgeItems([])
                    toast.info('Fridge cleared')
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {fridgeItems.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="capitalize pl-2.5 pr-1.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              >
                {item}
                <button
                  type="button"
                  onClick={() => {
                    toggleFridgeItem(item)
                    setFridgeItems(getFridgeItems())
                  }}
                  className="hover:text-rose-500 transition-colors ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {/* Quick Add Dialog Trigger */}
            <Dialog>
              <DialogHeader className="hidden"><DialogTitle>Add Items</DialogTitle></DialogHeader>
              <DialogContent className="max-w-md p-6 rounded-2xl border-0 shadow-xl bg-background">
                <h3 className="font-semibold mb-4 text-center">Add Ingredients</h3>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {QUICK_STAPLES.map((st) => {
                    const isActive = fridgeItems.includes(st.key)
                    return (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => {
                          toggleFridgeItem(st.key)
                          setFridgeItems(getFridgeItems())
                        }}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border',
                          isActive
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-muted hover:bg-muted/80 text-foreground border-transparent'
                        )}
                      >
                        {st.icon} {st.name}
                      </button>
                    )
                  })}
                </div>
                <form onSubmit={handleAddCustomStaple} className="flex gap-2">
                  <Input
                    placeholder="Type anything (e.g. mushrooms)"
                    value={customItemInput}
                    onChange={(e) => setCustomItemInput(e.target.value)}
                    className="h-10 text-sm rounded-xl border-border/60 bg-muted/50 focus-visible:ring-emerald-500"
                  />
                  <Button type="submit" className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                    Add
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2.5 py-0 text-xs font-medium rounded-lg border-dashed text-muted-foreground hover:text-foreground"
              onClick={() => document.querySelector<HTMLButtonElement>('[data-state="closed"]')?.click()}
            >
              <Plus className="h-3 w-3 mr-1" /> Add Items
            </Button>
          </div>
        </div>

        <div ref={recipesRef} className="space-y-3 pt-2">
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search 1,200+ recipes by name or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-xs md:text-sm rounded-2xl border-2 border-border/80 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 sm:flex-wrap sm:mx-0 sm:px-0">
            {MEAL_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat
              if (cat === 'Favorites') {
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border-2 select-none active:scale-95 shadow-2xs',
                      isActive
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white border-amber-600 shadow-sm'
                        : 'bg-card text-foreground border-border/80 hover:border-amber-400'
                    )}
                  >
                    <Star className={cn('h-3.5 w-3.5', isActive ? 'fill-white' : 'fill-amber-500 text-amber-500')} />
                    <span>Favorites</span>
                    <span className={cn('text-[10px] px-1.5 py-0.2 rounded-full font-extrabold', isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground')}>
                      {favoriteIds.length}
                    </span>
                  </button>
                )
              }

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border-2 select-none active:scale-95 shadow-2xs',
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-card text-foreground border-border/80 hover:border-emerald-500'
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* 5. Recipes Grid */}
        {processedRecipes.length === 0 ? (
          <Card className="border-dashed border-2 border-border/80 flex flex-col items-center justify-center p-8 md:p-12 text-center min-h-[250px] bg-muted/5 rounded-3xl">
            <div className="h-14 w-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-3">
              <UtensilsCrossed className="h-7 w-7" />
            </div>
            <h3 className="font-extrabold text-base md:text-lg mb-1">No matching recipes found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">
              Try adding more staples to your fridge or clearing the search filter to browse all 1,200 recipes!
            </p>
            <Button
              size="sm"
              variant="outline"
              className="border-2 font-bold"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All Meals')
              }}
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {processedRecipes.map((recipe) => {
              const isFav = favoriteIds.includes(recipe.id)
              const isLiked = likedIds.includes(recipe.id)
              const currentLikes = recipe.likes + (likeDeltas[recipe.id] || 0)

              return (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="group flex gap-3 p-3 border border-border/40 hover:bg-muted/30 cursor-pointer transition-colors active:scale-[0.99] bg-card rounded-2xl"
                >
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-muted">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {recipe.isCompleteMatch && (
                      <div className="absolute top-1 left-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        Match
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          {recipe.category}
                        </span>
                        <button onClick={(e) => handleToggleFavorite(recipe.id, e)} className="text-muted-foreground hover:text-amber-500 transition-colors p-1 -mr-1">
                          <Star className={cn('h-3.5 w-3.5', isFav && 'fill-amber-500 text-amber-500')} />
                        </button>
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {recipe.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {recipe.cookTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {recipe.servings} Servings
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* =================================================================== */}
      {/* MOBILE STICKY BOTTOM NAVIGATION BAR                                */}
      {/* =================================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/40 md:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4 h-14 items-center text-center">
          <button
            type="button"
            onClick={() => scannerRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-emerald-600 active:scale-95"
          >
            <Camera className="h-5 w-5" />
            <span className="text-[10px] font-medium">Scan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All Meals')
              recipesRef.current?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-emerald-600 active:scale-95"
          >
            <ChefHat className="h-5 w-5" />
            <span className="text-[10px] font-medium">Meals</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Favorites')
              recipesRef.current?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-amber-500 active:scale-95"
          >
            <Star className="h-5 w-5" />
            <span className="text-[10px] font-medium">Favorites</span>
          </button>

          <button
            type="button"
            onClick={() => setProModalOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-emerald-600 active:scale-95"
          >
            <Zap className="h-5 w-5" />
            <span className="text-[10px] font-medium">Pro</span>
          </button>
        </div>
      </nav>

      {/* =================================================================== */}
      {/* FULL RECIPE DETAIL DIALOG                                          */}
      {/* =================================================================== */}
      <Dialog
        open={selectedRecipe !== null && !isCooking}
        onOpenChange={(open) => {
          if (!open) {
            stopRecipeSpeech()
            setSelectedRecipe(null)
            setTimeout(() => setServingMultiplier(1), 300) // Reset after animation
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-5 md:p-6 border-2 border-border/80 rounded-3xl">
          {selectedRecipe && (
            <div className="space-y-5">
              <DialogHeader className="text-left space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {selectedRecipe.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {recipeLanguage === 'es' ? 'Dificultad:' : 'Difficulty:'}{' '}
                      <strong>{selectedRecipe.difficulty}</strong>
                    </span>

                    {/* Language Switcher */}
                    <div className="inline-flex items-center rounded-full bg-muted p-0.5 border border-border/80">
                      <button
                        type="button"
                        onClick={() => handleRecipeLanguageToggle('en')}
                        className={cn(
                          'px-2 py-0.5 text-[10px] font-black rounded-full transition-all flex items-center gap-1',
                          recipeLanguage === 'en'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <span>🇺🇸</span> EN
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRecipeLanguageToggle('es')}
                        className={cn(
                          'px-2 py-0.5 text-[10px] font-black rounded-full transition-all flex items-center gap-1',
                          recipeLanguage === 'es'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <span>🇲🇽</span> ES
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(selectedRecipe.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border-2 transition-all active:scale-95 shadow-2xs',
                        likedIds.includes(selectedRecipe.id)
                          ? 'bg-rose-500 text-white border-rose-600 shadow-rose-500/25'
                          : 'bg-background hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 border-border/80'
                      )}
                      title={likedIds.includes(selectedRecipe.id) ? 'Unlike meal' : 'Like meal'}
                    >
                      <Heart
                        className={cn(
                          'h-3.5 w-3.5 transition-transform',
                          likedIds.includes(selectedRecipe.id) ? 'fill-white text-white scale-110' : 'text-muted-foreground'
                        )}
                      />
                      <span>{(selectedRecipe.likes || 0) + (likeDeltas[selectedRecipe.id] || 0)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(selectedRecipe.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border-2 transition-all active:scale-95 shadow-2xs',
                        favoriteIds.includes(selectedRecipe.id)
                          ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-amber-400/25'
                          : 'bg-background hover:bg-amber-400/10 text-muted-foreground hover:text-amber-600 border-border/80'
                      )}
                      title={favoriteIds.includes(selectedRecipe.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star
                        className={cn(
                          'h-3.5 w-3.5 transition-transform',
                          favoriteIds.includes(selectedRecipe.id) ? 'fill-amber-950 text-amber-950 scale-110' : 'text-muted-foreground'
                        )}
                      />
                      <span>{favoriteIds.includes(selectedRecipe.id) ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>

                <DialogTitle className="text-lg md:text-xl font-black leading-snug">
                  {selectedRecipe.title}
                </DialogTitle>
                <DialogDescription className="text-xs leading-relaxed">
                  {selectedRecipe.description}
                </DialogDescription>
              </DialogHeader>

              {/* Prep & Yield Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-muted/40 border-2 border-border/60 text-center text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">Prep</span>
                  <span className="font-bold text-foreground">{selectedRecipe.prepTime}</span>
                </div>
                <div className="border-x-2 border-border/60">
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">Cook</span>
                  <span className="font-bold text-foreground">{selectedRecipe.cookTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">Yield</span>
                  <span className="font-bold text-foreground">{selectedRecipe.servings * servingMultiplier} Servings</span>
                </div>
              </div>

              {/* Serving Scaler & Nutrition */}
              <div className="space-y-4 pt-2">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Scale Recipe:</span>
                    <div className="flex gap-2">
                       {[1, 2, 3, 4].map(num => (
                         <Button 
                            key={num} 
                            size="sm" 
                            variant={servingMultiplier === num ? 'default' : 'outline'} 
                            onClick={() => setServingMultiplier(num)} 
                            className={cn("h-8 w-10 text-xs font-bold border-2 transition-all", servingMultiplier === num ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                         >
                            {num}x
                         </Button>
                       ))}
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-4 gap-2">
                    {(() => {
                       const nut = getRecipeNutrition(selectedRecipe, servingMultiplier);
                       return [
                          { label: 'Calories', val: nut.cal },
                          { label: 'Protein', val: nut.pro + 'g' },
                          { label: 'Carbs', val: nut.carb + 'g' },
                          { label: 'Fat', val: nut.fat + 'g' },
                       ].map(n => (
                          <div key={n.label} className="bg-muted/30 border-2 border-border/60 rounded-xl p-2 text-center flex flex-col items-center justify-center">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">{n.label}</span>
                            <span className="text-sm font-black text-foreground">{n.val}</span>
                          </div>
                       ))
                    })()}
                 </div>
              </div>

              {/* Ingredients Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Ingredients by Category:
                </h4>
                <div className="space-y-2.5">
                  {['Proteins', 'Produce', 'Dairy', 'Pantry & Grains', 'Spices & Sauces'].map(
                    (cat) => {
                      const itemsInCat = selectedRecipe.ingredients.filter(
                        (i) => i.category === cat
                      )
                      if (itemsInCat.length === 0) return null

                      return (
                        <div key={cat} className="space-y-1">
                          <span
                            className={cn(
                              'inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border',
                              INGREDIENT_CATEGORY_COLORS[cat] || 'bg-muted text-foreground'
                            )}
                          >
                            {cat}
                          </span>
                          <ul className="divide-y-2 divide-border/60 rounded-xl border-2 border-border/70 bg-card overflow-hidden text-xs shadow-2xs">
                            {itemsInCat.map((ing) => {
                              const inFridge = fridgeItems.some(
                                (f) =>
                                  ing.standardKey.toLowerCase().includes(f) ||
                                  f.includes(ing.standardKey.toLowerCase())
                              )
                              return (
                                <li
                                  key={ing.item}
                                  className={cn(
                                    'flex items-center justify-between p-2.5 px-3',
                                    inFridge && 'bg-emerald-500/10'
                                  )}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span
                                      className={cn(
                                        'h-5 w-5 rounded-full flex items-center justify-center text-[10px] border-2',
                                        inFridge
                                          ? 'bg-emerald-500 text-white border-emerald-600 font-bold shadow-xs'
                                          : 'border-border/80 text-muted-foreground bg-muted/40'
                                      )}
                                    >
                                      {inFridge ? '✓' : '•'}
                                    </span>
                                    <span className="font-semibold text-foreground">
                                      {translateIngredientName(ing.item, recipeLanguage)}
                                    </span>
                                    {inFridge && (
                                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded bg-emerald-500/15">
                                        (In Fridge)
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-muted-foreground font-mono text-[11px] font-semibold">
                                    {scaleIngredientAmount(ing.amount, servingMultiplier)}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>

              {/* Step-by-Step Instructions & Audio Read-Aloud */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ChefHat className="h-4 w-4 text-emerald-600" />
                    {recipeLanguage === 'es' ? 'Instrucciones de Cocina:' : 'Cooking Instructions:'}
                  </h4>

                  {/* Read Aloud Button */}
                  <Button
                    type="button"
                    size="sm"
                    onClick={toggleRecipeAudio}
                    className={cn(
                      'h-8 px-3 rounded-xl text-xs font-black gap-1.5 transition-all shadow-xs active:scale-95',
                      isRecipeSpeaking
                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    )}
                  >
                    {isRecipeSpeaking ? (
                      <>
                        <VolumeX className="h-3.5 w-3.5" />
                        <span>{recipeLanguage === 'es' ? 'Detener' : 'Stop Audio'}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>{recipeLanguage === 'es' ? 'Escuchar Receta' : 'Read Instructions'}</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Speed Controls (0.5x to 1.5x) */}
                <div className="flex items-center justify-between bg-muted/40 px-3 py-1.5 rounded-xl border border-border/60 text-[11px]">
                  <span className="font-bold text-muted-foreground">
                    {recipeLanguage === 'es' ? 'Velocidad de voz:' : 'Audio Speed:'}
                  </span>
                  <div className="flex items-center gap-1">
                    {SPEECH_RATES.map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleRecipeSpeedChange(rate)}
                        className={cn(
                          'px-2 py-0.5 rounded-md font-mono font-bold text-[11px] transition-all',
                          recipeSpeechRate === rate
                            ? 'bg-foreground text-background shadow-xs font-black'
                            : 'bg-background/80 hover:bg-background text-foreground/80 border border-border/50'
                        )}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                <ol className="space-y-2.5">
                  {selectedRecipe.instructions.map((step, idx) => {
                    const displayedStep =
                      recipeLanguage === 'es' ? translateInstructionStep(step, 'es') : step
                    const isCurrent = isRecipeSpeaking && recipeSpeakingStep === idx

                    return (
                      <li
                        key={idx}
                        className={cn(
                          'flex gap-3 text-xs leading-relaxed p-2 rounded-xl transition-all',
                          isCurrent
                            ? 'bg-emerald-500/15 border-2 border-emerald-500/40 shadow-xs'
                            : 'hover:bg-muted/30'
                        )}
                      >
                        <span
                          className={cn(
                            'h-6 w-6 rounded-full flex items-center justify-center font-extrabold text-[11px] shrink-0 mt-0.5 shadow-xs transition-colors',
                            isCurrent
                              ? 'bg-emerald-600 text-white animate-bounce'
                              : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white'
                          )}
                        >
                          {idx + 1}
                        </span>
                        <span
                          className={cn(
                            'font-medium',
                            isCurrent ? 'text-emerald-950 dark:text-emerald-100 font-bold' : 'text-foreground'
                          )}
                        >
                          {displayedStep}
                        </span>
                      </li>
                    )
                  })}
                </ol>
              </div>

              {/* Finished Dish Presentation Photo */}
              <div className="space-y-2.5 pt-3 border-t-2 border-border/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-emerald-600" />
                    Finished Dish Presentation:
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Plated & Ready to Serve
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden border-2 border-border/70 shadow-md group bg-muted/30">
                  <div className="aspect-[16/10] w-full overflow-hidden relative">
                    <img
                      src={selectedRecipe.imageUrl}
                      alt={selectedRecipe.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
                          {selectedRecipe.category}
                        </span>
                        <span className="text-[11px] text-white/80 font-medium">
                          {selectedRecipe.cookTime} • {selectedRecipe.servings} Servings
                        </span>
                      </div>
                      <h5 className="font-extrabold text-sm md:text-base leading-tight drop-shadow-sm">
                        {selectedRecipe.title}
                      </h5>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-center text-muted-foreground italic">
                  ✨ What your completed {selectedRecipe.title} looks like once prepared and plated hot!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t-2 border-border/60 flex flex-col gap-2">
                <Button
                  size="lg"
                  className="w-full gap-2 text-sm font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg h-12 rounded-2xl active:scale-98"
                  onClick={() => {
                    stopRecipeSpeech()
                    setIsCooking(true)
                  }}
                >
                  <Flame className="h-4 w-4 fill-white" />
                  <span>{recipeLanguage === 'es' ? 'Empezar a Cocinar' : 'Start Cooking'}</span>
                </Button>
                
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'gap-1.5 text-xs font-bold border-2 transition-all flex-1',
                      favoriteIds.includes(selectedRecipe.id)
                        ? 'bg-amber-400/20 text-amber-950 dark:text-amber-200 border-amber-500'
                        : 'border-border/80 text-foreground hover:border-amber-400'
                    )}
                    onClick={() => handleToggleFavorite(selectedRecipe.id)}
                  >
                    <Star
                      className={cn(
                        'h-3.5 w-3.5',
                        favoriteIds.includes(selectedRecipe.id) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'
                      )}
                    />
                    <span>{favoriteIds.includes(selectedRecipe.id) ? 'Favorited ⭐' : 'Favorite'}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs flex-1 border-2 font-bold"
                    onClick={() => copyRecipe(selectedRecipe)}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Recipe</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer & Compliance */}
      <footer className="mt-16 border-t-2 border-border/60 py-8 px-4 text-center text-xs text-muted-foreground">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-foreground">SnapChef AI</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
            <a href="/privacy" className="hover:text-emerald-500 hover:underline">
              Privacy Policy
            </a>
            <span className="text-border">•</span>
            <a href="/terms" className="hover:text-emerald-500 hover:underline">
              Terms of Service
            </a>
            <span className="text-border">•</span>
            <a href="/account-deletion" className="hover:text-emerald-500 hover:underline">
              Delete Account &amp; Data
            </a>
            <span className="text-border">•</span>
            <a href="mailto:sammyfirst722@gmail.com" className="hover:text-emerald-500 hover:underline">
              Support
            </a>
          </div>
        </div>
      </footer>

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal open={proModalOpen} onOpenChange={setProModalOpen} />

      {/* Cook Mode Fullscreen Overlay */}
      {isCooking && selectedRecipe && (
        <CookMode
          recipe={selectedRecipe}
          onClose={() => setIsCooking(false)}
          servingMultiplier={servingMultiplier}
          initialLanguage={recipeLanguage}
        />
      )}
    </div>
  )
}

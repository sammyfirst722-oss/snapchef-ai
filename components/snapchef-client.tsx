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
} from 'lucide-react'
import { CameraScanner } from '@/components/camera-scanner'
import { AiLeftoverGenerator } from '@/components/ai-leftover-generator'
import { ProUpgradeModal } from '@/components/pro-upgrade-modal'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
      let matchedCount = 0
      const matchedIngredients: string[] = []
      const missingIngredients: string[] = []

      recipe.ingredients.forEach((ing) => {
        const k = ing.standardKey.toLowerCase()
        const isMatched = fridgeItems.some(
          (f) => k.includes(f) || f.includes(k) || ing.item.toLowerCase().includes(f)
        )
        if (isMatched) {
          matchedCount++
          matchedIngredients.push(ing.item)
        } else {
          missingIngredients.push(ing.item)
        }
      })

      const totalRequired = recipe.ingredients.length
      const matchScore = fridgeItems.length > 0 ? matchedCount / totalRequired : 0
      const isCompleteMatch = fridgeItems.length > 0 && matchedCount === totalRequired
      const isAlmostMatch = fridgeItems.length > 0 && totalRequired - matchedCount === 1

      return {
        ...recipe,
        matchedCount,
        totalRequired,
        matchScore,
        isCompleteMatch,
        isAlmostMatch,
        matchedIngredients,
        missingIngredients,
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
      <header className="sticky top-0 z-40 w-full border-b-2 border-border/80 bg-background/95 backdrop-blur-md">
        <div className="container max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-500 text-white flex items-center justify-center shadow-md border-2 border-emerald-400">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg md:text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-emerald-600 bg-clip-text">
                  SnapChef
                </span>
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] px-1.5 py-0.2 border border-emerald-500/30">
                  AI
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground hidden sm:block font-medium">
                Snap your fridge. Cook in 15 mins.
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Pro Upgrade / Badge Button */}
            {isPro ? (
              <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black border-2 border-amber-600 text-xs px-2.5 py-1 gap-1 shadow-sm">
                <Zap className="h-3.5 w-3.5 fill-amber-950" />
                <span>PRO ACTIVE</span>
              </Badge>
            ) : (
              <Button
                size="sm"
                onClick={() => setProModalOpen(true)}
                className="gap-1.5 font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs h-9 rounded-xl shadow-md border border-amber-400 active:scale-95"
              >
                <Zap className="h-3.5 w-3.5 fill-white" />
                <span>Upgrade Pro</span>
              </Button>
            )}

            {/* Dark / Light Mode Toggle */}
            {mounted && (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-2 border-border/80 rounded-xl"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
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

        {/* 2. Active Fridge Inventory & Staples Box */}
        <Card className="border-2 border-border/80 bg-card rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-border/60 pb-3">
            <div>
              <h3 className="font-black text-sm md:text-base flex items-center gap-2">
                <span>🧊 In Your Fridge</span>
                <Badge variant="secondary" className="text-xs font-bold tabular-nums">
                  {fridgeItems.length} Items
                </Badge>
              </h3>
              <p className="text-xs text-muted-foreground">
                Recipes below automatically update based on these ingredients
              </p>
            </div>

            {fridgeItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearFridgeItems()
                  setFridgeItems([])
                  toast.info('Fridge cleared')
                }}
                className="h-8 text-xs text-muted-foreground hover:text-rose-500 self-start sm:self-auto font-bold"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Active Items Chips */}
          {fridgeItems.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {fridgeItems.map((item) => (
                <Badge
                  key={item}
                  className="capitalize gap-1.5 pl-3 pr-1.5 py-1 text-xs border-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 font-bold rounded-xl"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => {
                      toggleFridgeItem(item)
                      setFridgeItems(getFridgeItems())
                    }}
                    className="hover:text-rose-600 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="py-2 text-center text-xs text-muted-foreground italic">
              Your fridge is currently empty. Tap the camera above or quick staples below to get started!
            </div>
          )}

          {/* Quick Staple One-Tap Chips */}
          <div className="space-y-2 pt-1 border-t-2 border-border/50">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
              Quick Add Common Staples:
            </span>
            <div className="flex flex-wrap gap-1.5">
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
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border-2 select-none active:scale-95 shadow-2xs',
                      isActive
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                        : 'bg-muted/40 text-foreground border-border/70 hover:border-emerald-500/60'
                    )}
                  >
                    <span>{st.icon}</span>
                    <span>{st.name}</span>
                    {isActive ? (
                      <Check className="h-3 w-3 ml-0.5 stroke-[3]" />
                    ) : (
                      <Plus className="h-3 w-3 ml-0.5 text-muted-foreground" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Custom Item Form */}
            <form onSubmit={handleAddCustomStaple} className="flex gap-2 pt-2">
              <Input
                placeholder="Type any other ingredient (e.g. mushrooms, soy sauce, noodles)..."
                value={customItemInput}
                onChange={(e) => setCustomItemInput(e.target.value)}
                className="h-10 text-xs rounded-xl border-2 border-border/80"
              />
              <Button type="submit" size="sm" className="h-10 px-4 font-bold rounded-xl shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </form>
          </div>
        </Card>

        {/* 3. AI Leftover Invent Button Banner */}
        <AiLeftoverGenerator />

        {/* 4. Search & Category Filters Bar */}
        <div ref={recipesRef} className="space-y-3 pt-2">
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search 110+ recipes by name or ingredient..."
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
              Try adding more staples to your fridge or clearing the search filter to browse all 110 recipes!
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedRecipes.map((recipe) => {
              const isFav = favoriteIds.includes(recipe.id)
              const isLiked = likedIds.includes(recipe.id)
              const currentLikes = recipe.likes + (likeDeltas[recipe.id] || 0)

              return (
                <Card
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="group border-2 border-border/80 hover:border-emerald-500/70 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden active:scale-[0.99] bg-card rounded-3xl"
                >
                  {/* Recipe Image with Overlays */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/40">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Left: Category & Match Badge */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      <Badge variant="secondary" className="text-[10px] font-bold bg-background/90 backdrop-blur-xs shadow-xs text-foreground border border-border/60">
                        {recipe.category}
                      </Badge>
                      {fridgeItems.length > 0 && (
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-black tabular-nums shadow-xs backdrop-blur-xs border',
                            recipe.isCompleteMatch
                              ? 'bg-emerald-500 text-white border-emerald-400'
                              : recipe.isAlmostMatch
                              ? 'bg-amber-500 text-white border-amber-400'
                              : 'bg-background/90 text-foreground border-border/60'
                          )}
                        >
                          {recipe.isCompleteMatch
                            ? '✨ Ready to Cook!'
                            : recipe.isAlmostMatch
                            ? 'Missing 1 item'
                            : `${recipe.matchedCount}/${recipe.totalRequired} in Fridge`}
                        </span>
                      )}
                    </div>

                    {/* Top Right: Favorite & Like Buttons */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(recipe.id, e)}
                        title={isFav ? 'Remove favorite' : 'Add to favorites'}
                        className={cn(
                          'h-7 w-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-85 border shadow-sm',
                          isFav
                            ? 'bg-amber-500 text-white border-amber-400 shadow-amber-500/40'
                            : 'bg-black/50 hover:bg-black/70 text-white border-white/20'
                        )}
                      >
                        <Star className={cn('h-3.5 w-3.5', isFav && 'fill-white')} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(recipe.id, e)}
                        title={isLiked ? 'Unlike' : 'Like'}
                        className={cn(
                          'h-7 px-2 rounded-full flex items-center gap-1 text-[11px] font-bold backdrop-blur-md transition-all active:scale-85 border shadow-sm tabular-nums',
                          isLiked
                            ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/40'
                            : 'bg-black/50 hover:bg-black/70 text-white border-white/20'
                        )}
                      >
                        <Heart className={cn('h-3.5 w-3.5', isLiked && 'fill-white text-white')} />
                        <span>{currentLikes}</span>
                      </button>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium drop-shadow-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-amber-400" />
                        {recipe.cookTime}
                      </span>
                      <span className="flex items-center gap-1 text-white/90">
                        <Users className="h-3 w-3" />
                        {recipe.servings} Servings
                      </span>
                    </div>
                  </div>

                  <CardHeader className="p-4 pb-2 space-y-1">
                    <h3 className="font-bold text-sm md:text-base leading-snug group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  </CardHeader>

                  <CardContent className="p-4 pt-1 pb-3 flex-1">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Ingredients ({recipe.ingredients.length}):
                      </span>
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                        {recipe.ingredients.map((ing) => {
                          const isMatched = fridgeItems.some(
                            (f) =>
                              ing.standardKey.toLowerCase().includes(f) ||
                              f.includes(ing.standardKey.toLowerCase())
                          )
                          return (
                            <span
                              key={ing.item}
                              className={cn(
                                'inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border font-semibold',
                                isMatched
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                  : 'bg-muted/40 text-muted-foreground border-border/50'
                              )}
                            >
                              {isMatched && <Check className="h-2.5 w-2.5 text-emerald-600" />}
                              {ing.item}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-3.5 pt-2 border-t-2 border-border/50 flex items-center justify-between text-xs text-muted-foreground bg-muted/10">
                    <span className="text-[11px] font-medium">
                      Difficulty: <strong className="text-foreground">{recipe.difficulty}</strong>
                    </span>
                    <span className="font-bold text-emerald-600 text-[11px] group-hover:translate-x-0.5 transition-transform">
                      View Recipe →
                    </span>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {/* =================================================================== */}
      {/* MOBILE STICKY BOTTOM NAVIGATION BAR                                */}
      {/* =================================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t-2 border-border/80 md:hidden shadow-lg">
        <div className="grid grid-cols-4 h-16 items-center text-center">
          <button
            type="button"
            onClick={() => scannerRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-emerald-600 active:scale-95"
          >
            <Camera className="h-5 w-5" />
            <span className="text-[10px] font-bold">Scan</span>
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
            <span className="text-[10px] font-bold">110 Meals</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Favorites')
              recipesRef.current?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-amber-500 active:scale-95"
          >
            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            <span className="text-[10px] font-bold">Favorites</span>
          </button>

          <button
            type="button"
            onClick={() => setProModalOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-amber-500 active:scale-95 font-black"
          >
            <Zap className="h-5 w-5 fill-amber-500" />
            <span className="text-[10px] font-black">Pro</span>
          </button>
        </div>
      </nav>

      {/* =================================================================== */}
      {/* FULL RECIPE DETAIL DIALOG                                          */}
      {/* =================================================================== */}
      <Dialog
        open={selectedRecipe !== null}
        onOpenChange={(open) => !open && setSelectedRecipe(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-5 md:p-6 border-2 border-border/80 rounded-3xl">
          {selectedRecipe && (
            <div className="space-y-5">
              <DialogHeader className="text-left space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {selectedRecipe.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Difficulty: <strong>{selectedRecipe.difficulty}</strong>
                    </span>
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
                  <span className="font-bold text-foreground">{selectedRecipe.servings} Servings</span>
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
                                    <span className="font-semibold text-foreground">{ing.item}</span>
                                    {inFridge && (
                                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded bg-emerald-500/15">
                                        (In Fridge)
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-muted-foreground font-mono text-[11px] font-semibold">
                                    {ing.amount}
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

              {/* Step-by-Step Instructions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ChefHat className="h-4 w-4 text-emerald-600" />
                  Cooking Instructions:
                </h4>
                <ol className="space-y-2.5">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-xs leading-relaxed">
                      <span className="h-6 w-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-[11px] shrink-0 mt-0.5 shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="text-foreground font-medium">{step}</span>
                    </li>
                  ))}
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
              <div className="pt-3 border-t-2 border-border/60 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'gap-1.5 text-xs font-bold border-2 transition-all',
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
                  <span>{favoriteIds.includes(selectedRecipe.id) ? 'Favorited ⭐' : 'Add to Favorites'}</span>
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
                      <span>Copied Recipe!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Recipe</span>
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="default"
                  className="text-xs font-bold px-4"
                  onClick={() => setSelectedRecipe(null)}
                >
                  Done
                </Button>
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
    </div>
  )
}

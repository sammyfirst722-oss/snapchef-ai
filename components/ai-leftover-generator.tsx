'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  ChefHat,
  Clock,
  Flame,
  Check,
  Copy,
  Star,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  PlusCircle,
  Play,
  Zap,
} from 'lucide-react'
import { getFridgeItems } from '@/lib/fridge-store'
import { toggleFavoriteRecipe, getFavoriteRecipeIds } from '@/lib/recipes-store'
import { getMatchingFoodImage } from '@/lib/food-image-matcher'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface GeneratedRecipe {
  title: string
  category: string
  prepTime: string
  cookTime: string
  servings: number
  difficulty: string
  description: string
  ingredients: { item: string; amount: string }[]
  instructions: string[]
  chefTip?: string
}

interface AiLeftoverGeneratorProps {
  onCookRecipe?: (recipe: any) => void
  onOpenProModal?: () => void
  buttonVariant?: 'banner' | 'card' | 'inline'
}

const DAILY_LIMIT = 5
const STORAGE_KEY_USAGE = 'snapchef_ai_generations_today'

export function AiLeftoverGenerator({
  onCookRecipe,
  onOpenProModal,
  buttonVariant = 'banner',
}: AiLeftoverGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recipes, setRecipes] = useState<GeneratedRecipe[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string>('Quick & Easy')
  const [customNote, setCustomNote] = useState('')
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [generationsUsed, setGenerationsUsed] = useState(0)
  const [isPro, setIsPro] = useState(false)

  const tags = ['Quick & Easy', 'High-Protein 💪', 'Comfort Food', '15-Min One-Pan', 'Low-Carb']

  useEffect(() => {
    setFavoriteIds(getFavoriteRecipeIds())
    try {
      const pro = localStorage.getItem('snapchef_pro_status_v1') === 'true'
      setIsPro(pro)

      const stored = localStorage.getItem(STORAGE_KEY_USAGE)
      if (stored) {
        const { date, count } = JSON.parse(stored)
        const today = new Date().toISOString().slice(0, 10)
        if (date === today) {
          setGenerationsUsed(count)
        } else {
          localStorage.setItem(STORAGE_KEY_USAGE, JSON.stringify({ date: today, count: 0 }))
          setGenerationsUsed(0)
        }
      }
    } catch {
      // fallback
    }
  }, [open])

  const recordGeneration = () => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const nextCount = generationsUsed + 1
      setGenerationsUsed(nextCount)
      localStorage.setItem(STORAGE_KEY_USAGE, JSON.stringify({ date: today, count: nextCount }))
    } catch {
      // ignore
    }
  }

  const handleGenerate = async (appendMore = false) => {
    const fridge = getFridgeItems()
    if (fridge.length === 0) {
      toast.error('Your fridge is empty!', {
        description: 'Add or scan some ingredients first so the AI knows what to cook with.',
      })
      return
    }

    if (!isPro && generationsUsed >= DAILY_LIMIT) {
      toast.info('Daily Free Limit Reached (5/5)', {
        description: 'Upgrade to SnapChef Pro for unlimited endless AI meal inventions!',
      })
      if (onOpenProModal) onOpenProModal()
      return
    }

    setLoading(true)

    try {
      const previousTitles = recipes.map((r) => r.title)
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: fridge,
          preferences: { style: selectedTag },
          customPrompt: customNote,
          count: 3,
          previousTitles,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate recipe')

      const newRecipes: GeneratedRecipe[] = Array.isArray(data.recipes) && data.recipes.length > 0
        ? data.recipes
        : data.recipe
        ? [data.recipe]
        : []

      if (newRecipes.length === 0) {
        throw new Error('No recipes returned')
      }

      recordGeneration()

      if (appendMore) {
        const currentLen = recipes.length
        setRecipes((prev) => [...prev, ...newRecipes])
        setActiveIndex(currentLen)
        toast.success(`Invented 3 more custom meals! 🍳✨`)
      } else {
        setRecipes(newRecipes)
        setActiveIndex(0)
        toast.success(`Invented ${newRecipes.length} custom meals! 👨‍🍳✨`)
      }
    } catch (err: any) {
      console.error(err)
      toast.error('Could not generate recipe', { description: err.message })
    } finally {
      setLoading(false)
    }
  }

  const currentRecipe = recipes[activeIndex] || recipes[0]

  const copyRecipe = async () => {
    if (!currentRecipe) return
    const text = `${currentRecipe.title} (${currentRecipe.category})\nPrep: ${currentRecipe.prepTime} | Cook: ${currentRecipe.cookTime} | Servings: ${currentRecipe.servings}\n\nINGREDIENTS:\n${currentRecipe.ingredients
      .map((i) => `• ${i.item} (${i.amount})`)
      .join('\n')}\n\nINSTRUCTIONS:\n${currentRecipe.instructions
      .map((step, idx) => `${idx + 1}. ${step}`)
      .join('\n')}\n\nCHEF TIP: ${currentRecipe.chefTip || 'Enjoy hot!'}`

    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Recipe copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCookMode = () => {
    if (!currentRecipe) return
    if (onCookRecipe) {
      // Adapt generated recipe to standard Recipe schema for CookMode
      const adapted = {
        id: `ai-gen-${Date.now()}`,
        title: currentRecipe.title,
        category: currentRecipe.category,
        prepTime: currentRecipe.prepTime,
        cookTime: currentRecipe.cookTime,
        servings: currentRecipe.servings,
        difficulty: currentRecipe.difficulty,
        description: currentRecipe.description,
        ingredients: currentRecipe.ingredients.map((ing) => ({
          item: ing.item,
          amount: ing.amount,
          category: 'Produce',
          standardKey: ing.item.toLowerCase(),
        })),
        instructions: currentRecipe.instructions,
        tags: ['ai-custom', 'fridge-leftover'],
        imageUrl: getMatchingFoodImage(currentRecipe),
        likes: 100,
      }
      setOpen(false)
      onCookRecipe(adapted)
    }
  }

  const handleFavoriteToggle = () => {
    if (!currentRecipe) return
    const pseudoId = `ai-${currentRecipe.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    const isFav = toggleFavoriteRecipe(pseudoId)
    setFavoriteIds(getFavoriteRecipeIds())
    toast.success(isFav ? 'Added to favorites!' : 'Removed from favorites')
  }

  const fridgeCount = typeof window !== 'undefined' ? getFridgeItems().length : 0

  return (
    <>
      {buttonVariant === 'banner' && (
        <div className="p-4 md:p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl shadow-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-emerald-400/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white font-black text-[10px] uppercase tracking-wider backdrop-blur-xs border-0">
                ✨ Endless AI Chef
              </Badge>
              {!isPro && (
                <span className="text-[11px] text-emerald-100 font-bold">
                  {DAILY_LIMIT - generationsUsed} free tries left today
                </span>
              )}
            </div>
            <h3 className="text-base md:text-lg font-black tracking-tight">
              Make Endless Custom Meals from Your Fridge
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xl">
              Don&apos;t just browse recipes — have our AI Chef invent 3 brand new, fast meals using your exact ingredients.
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={() => {
              setOpen(true)
              if (recipes.length === 0) handleGenerate()
            }}
            className="font-black bg-white text-emerald-950 hover:bg-emerald-50 shadow-md text-xs md:text-sm h-11 px-5 rounded-2xl active:scale-95 shrink-0 gap-2 border-0"
          >
            <Sparkles className="h-4 w-4 text-emerald-600 fill-emerald-600" />
            <span>Invent 3 Custom Meals</span>
          </Button>
        </div>
      )}

      {buttonVariant === 'inline' && (
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setOpen(true)
            if (recipes.length === 0) handleGenerate()
          }}
          className="font-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs h-9 rounded-xl shadow-xs gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5 fill-white" />
          <span>✨ Invent Meals with AI</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-5 md:p-6 border-2 border-emerald-500/40 rounded-3xl">
          <DialogHeader className="text-left space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-600 flex items-center justify-center">
                  <ChefHat className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg md:text-xl font-black tracking-tight">
                    Endless AI Chef
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    Inventing fresh meals with your {fridgeCount} fridge ingredients
                  </DialogDescription>
                </div>
              </div>

              {!isPro && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    if (onOpenProModal) onOpenProModal()
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-xl border border-amber-500/30 hover:bg-amber-500/20"
                >
                  <Zap className="h-3 w-3 fill-amber-500" />
                  <span>Go Pro</span>
                </button>
              )}
            </div>
          </DialogHeader>

          {/* Cooking Styles & Preferences Tags */}
          <div className="space-y-2 pt-1 border-t-2 border-border/60">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
              Meal Preference:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
                  className={cn(
                    'text-xs font-bold px-3 py-1 rounded-xl transition-all border-2 select-none active:scale-95 shadow-2xs',
                    selectedTag === t
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-card text-muted-foreground border-border/80 hover:border-emerald-400'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Regenerate & Endless Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              onClick={() => handleGenerate(false)}
              disabled={loading}
              className="gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-10 rounded-xl flex-1 shadow-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Inventing 3 Meals...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Invent Fresh 3 Meals</span>
                </>
              )}
            </Button>

            {recipes.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleGenerate(true)}
                disabled={loading}
                className="gap-1.5 font-bold text-xs h-10 rounded-xl border-2 border-border/80 hover:border-emerald-500"
              >
                <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>+ Make 3 More (Endless)</span>
              </Button>
            )}
          </div>

          {/* Multiple Recipes Tab Carousel Selector */}
          {recipes.length > 1 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                Choose from {recipes.length} invented meals:
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {recipes.map((r, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      'shrink-0 text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 max-w-[160px] truncate',
                      activeIndex === idx
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-2xs'
                        : 'bg-muted/40 border-border/70 text-muted-foreground hover:border-border'
                    )}
                  >
                    <span className="text-[10px] font-mono block text-emerald-600 dark:text-emerald-400">
                      Meal #{idx + 1}
                    </span>
                    <span className="truncate block">{r.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generated Recipe Presentation */}
          {currentRecipe && !loading && (
            <div className="space-y-4 pt-2 border-t-2 border-border/60">
              {/* Recipe Title & Meta */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] font-bold border border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100">
                    {currentRecipe.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Difficulty: <strong className="text-foreground">{currentRecipe.difficulty}</strong>
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-black leading-snug text-foreground">
                  {currentRecipe.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {currentRecipe.description}
                </p>
              </div>

              {/* Time & Servings bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-muted/40 border-2 border-border/70 text-center text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">Prep</span>
                  <span className="font-bold text-foreground">{currentRecipe.prepTime}</span>
                </div>
                <div className="border-x-2 border-border/60">
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">Cook</span>
                  <span className="font-bold text-foreground">{currentRecipe.cookTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">Yield</span>
                  <span className="font-bold text-foreground">{currentRecipe.servings} Servings</span>
                </div>
              </div>

              {/* Ingredients Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Ingredients Needed:
                </h4>
                <ul className="divide-y-2 divide-border/60 rounded-2xl border-2 border-border/70 bg-card overflow-hidden text-xs shadow-2xs">
                  {currentRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center justify-between p-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                        <span className="font-semibold text-foreground">{ing.item}</span>
                      </div>
                      <span className="font-mono text-muted-foreground text-[11px] font-semibold">
                        {ing.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  Step-by-Step Cooking Steps:
                </h4>
                <ol className="space-y-2">
                  {currentRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs leading-relaxed">
                      <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </span>
                      <span className="text-foreground font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Chef Pro Tip Callout */}
              {currentRecipe.chefTip && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex gap-2.5 items-start text-xs">
                  <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950 dark:text-amber-200 block text-[11px] uppercase tracking-wide">
                      Chef&apos;s Pro Tip:
                    </span>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">
                      {currentRecipe.chefTip}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                {onCookRecipe && (
                  <Button
                    type="button"
                    size="sm"
                    className="flex-1 min-w-[130px] font-bold text-xs h-10 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                    onClick={handleCookMode}
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Start Cook Mode</span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 text-xs border-2 font-bold rounded-xl"
                  onClick={handleFavoriteToggle}
                  title="Save to favorites"
                >
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 text-xs border-2 font-bold rounded-xl gap-1.5"
                  onClick={copyRecipe}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="font-bold text-xs h-10 px-3 text-muted-foreground"
                  onClick={() => setOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

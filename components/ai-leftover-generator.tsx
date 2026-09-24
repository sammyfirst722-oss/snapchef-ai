'use client'

import { useState } from 'react'
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
  Users,
  Flame,
  Check,
  Copy,
  Star,
  RefreshCw,
  Lightbulb,
  ArrowRight,
} from 'lucide-react'
import { getFridgeItems } from '@/lib/fridge-store'
import { toggleFavoriteRecipe, getFavoriteRecipeIds } from '@/lib/recipes-store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface GeneratedRecipe {
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

export function AiLeftoverGenerator() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string>('Quick & Easy')
  const [customNote, setCustomNote] = useState('')
  const [savedFavorite, setSavedFavorite] = useState(false)

  const tags = ['Quick & Easy', 'High-Protein 💪', 'Keto / Low-Carb', 'Spicy 🌶️', 'Comfort Food']

  const handleGenerate = async () => {
    const fridge = getFridgeItems()
    if (fridge.length === 0) {
      toast.error('Your fridge is empty!', {
        description: 'Add or scan some ingredients first so the AI knows what to cook with.',
      })
      return
    }

    setLoading(true)
    setRecipe(null)
    setSavedFavorite(false)

    try {
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: fridge,
          preferences: { style: selectedTag },
          customPrompt: customNote,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate recipe')

      setRecipe(data.recipe)
      toast.success('Custom recipe created! 👨‍🍳✨')
    } catch (err: any) {
      console.error(err)
      toast.error('Could not generate recipe', { description: err.message })
    } finally {
      setLoading(false)
    }
  }

  const copyRecipe = async () => {
    if (!recipe) return
    const text = `${recipe.title} (${recipe.category})\nPrep: ${recipe.prepTime} | Cook: ${recipe.cookTime} | Servings: ${recipe.servings}\n\nINGREDIENTS:\n${recipe.ingredients
      .map((i) => `• ${i.item} (${i.amount})`)
      .join('\n')}\n\nINSTRUCTIONS:\n${recipe.instructions
      .map((step, idx) => `${idx + 1}. ${step}`)
      .join('\n')}\n\nCHEF TIP: ${recipe.chefTip || 'Enjoy hot!'}`

    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Recipe copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        onClick={() => {
          setOpen(true)
          if (!recipe) handleGenerate()
        }}
        className="w-full gap-2 font-black bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg text-sm md:text-base h-12 rounded-2xl active:scale-98 border-2 border-orange-400"
      >
        <Sparkles className="h-5 w-5 fill-white animate-spin-slow" />
        <span>✨ Invent a Custom Meal From My Leftovers</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-5 md:p-6 border-2 border-amber-500/50 rounded-3xl">
          <DialogHeader className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-orange-500/15 border-2 border-orange-500/30 text-orange-600 flex items-center justify-center">
                <ChefHat className="h-4 w-4" />
              </div>
              <DialogTitle className="text-lg md:text-xl font-black tracking-tight">
                AI Leftover Chef
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs leading-relaxed">
              SnapChef analyzes your active fridge inventory to invent custom, gourmet recipes in seconds.
            </DialogDescription>
          </DialogHeader>

          {/* Cooking Styles & Preferences Tags */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
              Style & Diet:
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
                      ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
                      : 'bg-card text-muted-foreground border-border/80 hover:border-amber-400'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Regenerate button */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              onClick={handleGenerate}
              disabled={loading}
              className="gap-2 font-bold bg-orange-600 hover:bg-orange-700 text-white text-xs h-9 rounded-xl flex-1 shadow-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Chef is Cooking Up Recipe...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate New Meal</span>
                </>
              )}
            </Button>
          </div>

          {/* Generated Recipe Presentation */}
          {recipe && !loading && (
            <div className="space-y-4 pt-2 border-t-2 border-border/60">
              {/* Recipe Title & Meta */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] font-bold border border-orange-500/40 bg-orange-500/10 text-orange-950 dark:text-orange-100">
                    {recipe.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Difficulty: <strong className="text-foreground">{recipe.difficulty}</strong>
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-black leading-snug text-foreground">
                  {recipe.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              {/* Time & Servings bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-muted/40 border-2 border-border/70 text-center text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">Prep</span>
                  <span className="font-bold text-foreground">{recipe.prepTime}</span>
                </div>
                <div className="border-x-2 border-border/60">
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">Cook</span>
                  <span className="font-bold text-foreground">{recipe.cookTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">Yield</span>
                  <span className="font-bold text-foreground">{recipe.servings} Servings</span>
                </div>
              </div>

              {/* Ingredients Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Ingredients Needed:
                </h4>
                <ul className="divide-y-2 divide-border/60 rounded-2xl border-2 border-border/70 bg-card overflow-hidden text-xs shadow-2xs">
                  {recipe.ingredients.map((ing, idx) => (
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
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs leading-relaxed">
                      <span className="h-5 w-5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </span>
                      <span className="text-foreground font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Chef Pro Tip Callout */}
              {recipe.chefTip && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex gap-2.5 items-start text-xs">
                  <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950 dark:text-amber-200 block text-[11px] uppercase tracking-wide">
                      Chef&apos;s Pro Tip:
                    </span>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">
                      {recipe.chefTip}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 text-xs border-2 font-bold"
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
                      <span>Copy Recipe</span>
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="default"
                  className="font-bold text-xs px-4"
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

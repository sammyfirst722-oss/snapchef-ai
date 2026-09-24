'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Play, Square, List, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react'
import { Recipe } from '@/lib/recipes-data'
import { scaleIngredientAmount } from '@/lib/recipe-utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CookModeProps {
  recipe: Recipe
  onClose: () => void
  servingMultiplier?: number
}

function extractTimeInSeconds(text: string): number | null {
  const minMatch = text.match(/(\d+)\s*(min|minute)/i)
  if (minMatch) return parseInt(minMatch[1]) * 60

  const secMatch = text.match(/(\d+)\s*(sec|second)/i)
  if (secMatch) return parseInt(secMatch[1])
  
  const hrMatch = text.match(/(\d+)\s*(hr|hour)/i)
  if (hrMatch) return parseInt(hrMatch[1]) * 3600

  return null
}

export function CookMode({ recipe, onClose, servingMultiplier = 1 }: CookModeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [showIngredients, setShowIngredients] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Attempt wake lock
    let wakeLock: WakeLockSentinel | null = null
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen')
        }
      } catch (err) {
        console.warn('Wake lock error:', err)
      }
    }
    requestWakeLock()
    
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3')

    return () => {
      wakeLock?.release().catch(console.error)
    }
  }, [])

  useEffect(() => {
    setTimerRunning(false)
    const time = extractTimeInSeconds(recipe.instructions[currentStep])
    setTimeLeft(time)
  }, [currentStep, recipe.instructions])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev && prev <= 1) {
            setTimerRunning(false)
            audioRef.current?.play().catch(() => {})
            return 0
          }
          return (prev || 0) - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerRunning, timeLeft])

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(extractTimeInSeconds(recipe.instructions[currentStep]))
      setTimerRunning(true)
    } else {
      setTimerRunning(!timerRunning)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleNext = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep((c) => c + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((c) => c - 1)
    }
  }

  const progress = ((currentStep + 1) / recipe.instructions.length) * 100

  return (
    <div className="fixed inset-0 z-[100] bg-background text-foreground flex flex-col touch-none">
      {/* Top Bar */}
      <div className="relative flex items-center justify-between p-4 border-b-2 border-border/60 bg-card z-10 shadow-sm">
        <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        <div className="flex-1 min-w-0 pr-4">
          <Badge className="mb-1 bg-emerald-500 text-white border-emerald-600 shadow-xs text-[10px]">
            Step {currentStep + 1} of {recipe.instructions.length}
          </Badge>
          <h2 className="font-black text-lg md:text-xl truncate text-foreground">{recipe.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 border-2 border-transparent transition-all"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-3xl mx-auto w-full text-center">
          <p className="text-3xl md:text-5xl font-bold leading-snug text-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
            {recipe.instructions[currentStep]}
          </p>

          {/* Timer UI */}
          {timeLeft !== null && (
            <div className="mt-8 flex flex-col items-center animate-in zoom-in-95 fade-in duration-300">
              <div className="text-5xl font-black tabular-nums tracking-tighter text-emerald-600 bg-emerald-500/10 px-6 py-4 rounded-3xl border-2 border-emerald-500/20 shadow-inner">
                {formatTime(timeLeft)}
              </div>
              <Button
                onClick={toggleTimer}
                size="lg"
                className="mt-4 rounded-full h-14 px-8 text-lg font-bold shadow-lg"
                variant={timerRunning ? 'destructive' : 'default'}
              >
                {timerRunning ? <Square className="mr-2 h-5 w-5 fill-current" /> : <Play className="mr-2 h-5 w-5 fill-current" />}
                {timerRunning ? 'Pause Timer' : timeLeft === 0 ? 'Restart Timer' : 'Start Timer'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Ingredient Drawer Drawer */}
      <div className={cn(
        "absolute bottom-28 left-0 right-0 bg-card border-t-2 border-border/80 shadow-2xl transition-transform duration-300 z-20 rounded-t-3xl max-h-[50vh] flex flex-col",
        showIngredients ? "translate-y-0" : "translate-y-full"
      )}>
        <button 
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-card border-x-2 border-t-2 border-border/80 px-4 py-2 rounded-t-xl flex items-center gap-2 shadow-sm font-bold text-sm text-emerald-600 hover:bg-emerald-500/10 transition-colors"
          onClick={() => setShowIngredients(!showIngredients)}
        >
          <List className="h-4 w-4" />
          Ingredients
          {showIngredients ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
        <div className="p-4 overflow-y-auto">
          <ul className="space-y-2 max-w-lg mx-auto">
            {recipe.ingredients.map(ing => (
              <li key={ing.item} className="flex justify-between items-center text-sm p-2 border-b-2 border-border/40">
                <span className="font-semibold">{ing.item}</span>
                <span className="text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                  {scaleIngredientAmount(ing.amount, servingMultiplier)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-28 border-t-2 border-border/60 bg-background flex items-center justify-between px-4 md:px-8 z-30 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 0}
          variant="outline"
          className="h-16 w-32 rounded-2xl text-lg font-bold gap-2 active:scale-95 disabled:opacity-50 border-2"
        >
          <ChevronLeft className="h-6 w-6" /> Prev
        </Button>
        
        {currentStep === recipe.instructions.length - 1 ? (
          <Button
            onClick={onClose}
            className="h-16 w-32 rounded-2xl text-lg font-bold gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white active:scale-95 shadow-lg border-2 border-emerald-400"
          >
            Done <CheckCircle2 className="h-6 w-6" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={currentStep === recipe.instructions.length - 1}
            className="h-16 w-32 rounded-2xl text-lg font-bold gap-2 active:scale-95 disabled:opacity-50 border-2 bg-foreground text-background hover:bg-foreground/90"
          >
            Next <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  )
}

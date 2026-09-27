'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Square,
  List,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
} from 'lucide-react'
import { Recipe } from '@/lib/recipes-data'
import { scaleIngredientAmount } from '@/lib/recipe-utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Language,
  UI_TRANSLATIONS,
  translateIngredientName,
  translateInstructionStep,
} from '@/lib/translations/spanish'
import { speechManager, SPEECH_RATES, SpeechRate } from '@/lib/speech-utils'

interface CookModeProps {
  recipe: Recipe
  onClose: () => void
  servingMultiplier?: number
  initialLanguage?: Language
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

export function CookMode({
  recipe,
  onClose,
  servingMultiplier = 1,
  initialLanguage = 'en',
}: CookModeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [showIngredients, setShowIngredients] = useState(false)

  // Voice Read-Aloud & Language States
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [speechRate, setSpeechRate] = useState<SpeechRate>(1.0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoRead, setAutoRead] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const t = UI_TRANSLATIONS[language]

  // Clean, translated instruction text for current step
  const rawInstruction = recipe.instructions[currentStep] || ''
  const displayedInstruction =
    language === 'es' ? translateInstructionStep(rawInstruction, 'es') : rawInstruction

  // Speech handler
  const speakCurrentStep = useCallback(
    (rateToUse?: SpeechRate, langToUse?: Language) => {
      const activeLang = langToUse || language
      const activeRate = rateToUse !== undefined ? rateToUse : speechRate
      const textToSpeak =
        activeLang === 'es' ? translateInstructionStep(rawInstruction, 'es') : rawInstruction

      setIsSpeaking(true)
      speechManager.speak(textToSpeak, {
        rate: activeRate,
        lang: activeLang,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      })
    },
    [language, speechRate, rawInstruction]
  )

  const stopSpeaking = useCallback(() => {
    speechManager.stop()
    setIsSpeaking(false)
  }, [])

  const toggleSpeaking = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speakCurrentStep()
    }
  }, [isSpeaking, speakCurrentStep, stopSpeaking])

  const handleRateChange = (newRate: SpeechRate) => {
    setSpeechRate(newRate)
    if (isSpeaking) {
      speakCurrentStep(newRate)
    }
  }

  const handleLanguageToggle = (newLang: Language) => {
    setLanguage(newLang)
    if (isSpeaking) {
      speakCurrentStep(speechRate, newLang)
    }
  }

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
      speechManager.stop()
    }
  }, [])

  // When step changes, update timer and auto-read if enabled
  useEffect(() => {
    setTimerRunning(false)
    const time = extractTimeInSeconds(recipe.instructions[currentStep] || '')
    setTimeLeft(time)

    // Stop previous step audio
    speechManager.stop()
    setIsSpeaking(false)

    // If auto-read is active, read the new step aloud automatically
    if (autoRead) {
      const timer = setTimeout(() => {
        speakCurrentStep()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentStep, recipe.instructions, autoRead, speakCurrentStep])

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

  const handleClose = () => {
    stopSpeaking()
    onClose()
  }

  const progress = ((currentStep + 1) / recipe.instructions.length) * 100

  return (
    <div className="fixed inset-0 z-[100] bg-background text-foreground flex flex-col touch-none">
      {/* Top Bar */}
      <div className="relative flex items-center justify-between p-3 md:p-4 border-b-2 border-border/60 bg-card z-10 shadow-sm">
        <div
          className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-500 text-white border-emerald-600 shadow-xs text-[10px] font-bold">
              {t.step} {currentStep + 1} {t.of} {recipe.instructions.length}
            </Badge>

            {/* Language Toggle: EN / ES */}
            <div className="inline-flex items-center rounded-full bg-muted p-0.5 border border-border/80">
              <button
                type="button"
                onClick={() => handleLanguageToggle('en')}
                className={cn(
                  'px-2 py-0.5 text-[10px] font-black rounded-full transition-all flex items-center gap-1',
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span>🇺🇸</span> EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageToggle('es')}
                className={cn(
                  'px-2 py-0.5 text-[10px] font-black rounded-full transition-all flex items-center gap-1',
                  language === 'es'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span>🇲🇽</span> ES
              </button>
            </div>
          </div>
          <h2 className="font-black text-base md:text-xl truncate text-foreground">
            {recipe.title}
          </h2>
        </div>

        <button
          onClick={handleClose}
          className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 border-2 border-transparent transition-all"
          aria-label={t.close}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-between px-4 sm:px-8 md:px-12 py-4 relative overflow-y-auto bg-gradient-to-b from-background to-muted/20">
        {/* Voice Audio & Speed Controls Toolbar */}
        <div className="max-w-2xl mx-auto w-full flex flex-wrap items-center justify-between gap-2 bg-card/90 backdrop-blur-xs p-2.5 rounded-2xl border-2 border-border/70 shadow-xs mb-2">
          {/* Read Step Aloud Button */}
          <Button
            type="button"
            size="sm"
            onClick={toggleSpeaking}
            className={cn(
              'rounded-xl font-black gap-2 h-9 px-4 transition-all shadow-xs active:scale-95',
              isSpeaking
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            )}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-4 w-4" />
                <span>{t.stopReading}</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4" />
                <span>{t.readStep}</span>
              </>
            )}
          </Button>

          {/* Speed Selector: 0.5x to 1.5x (Sammy requested down to 0.5x) */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
            <span className="hidden sm:inline mr-1">{t.speed}:</span>
            {SPEECH_RATES.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleRateChange(rate)}
                className={cn(
                  'px-2 py-1 rounded-lg font-mono font-bold transition-all text-[11px]',
                  speechRate === rate
                    ? 'bg-foreground text-background shadow-xs font-black'
                    : 'bg-muted hover:bg-muted/80 text-foreground/80'
                )}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Hands-Free Auto-Read Toggle */}
          <button
            type="button"
            onClick={() => setAutoRead(!autoRead)}
            className={cn(
              'px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5',
              autoRead
                ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500 font-extrabold'
                : 'bg-muted/60 text-muted-foreground border-transparent hover:text-foreground'
            )}
            title="Automatically reads new steps aloud when navigating"
          >
            <Sparkles className="h-3 w-3" />
            <span>{t.autoRead}</span>
            <span
              className={cn(
                'inline-block w-2 h-2 rounded-full',
                autoRead ? 'bg-teal-500 animate-ping' : 'bg-muted-foreground/40'
              )}
            />
          </button>
        </div>

        {/* Big Instruction Text */}
        <div className="max-w-3xl mx-auto w-full my-auto text-center py-4">
          <p className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-snug sm:leading-tight text-foreground animate-in fade-in slide-in-from-bottom-3 duration-300">
            {displayedInstruction}
          </p>

          {/* Timer UI (if time detected in step) */}
          {timeLeft !== null && (
            <div className="mt-6 flex flex-col items-center animate-in zoom-in-95 fade-in duration-300">
              <div className="text-4xl sm:text-5xl font-black tabular-nums tracking-tighter text-emerald-600 bg-emerald-500/10 px-6 py-3 rounded-3xl border-2 border-emerald-500/20 shadow-inner">
                {formatTime(timeLeft)}
              </div>
              <Button
                onClick={toggleTimer}
                size="lg"
                className="mt-3 rounded-full h-12 px-6 text-base font-bold shadow-lg"
                variant={timerRunning ? 'destructive' : 'default'}
              >
                {timerRunning ? (
                  <Square className="mr-2 h-4 w-4 fill-current" />
                ) : (
                  <Play className="mr-2 h-4 w-4 fill-current" />
                )}
                {timerRunning
                  ? t.pauseTimer
                  : timeLeft === 0
                  ? t.restartTimer
                  : t.startTimer}
              </Button>
            </div>
          )}
        </div>

        {/* Space reservation for drawer */}
        <div className="h-8" />
      </div>

      {/* Ingredient Drawer */}
      <div
        className={cn(
          'absolute bottom-24 sm:bottom-28 left-0 right-0 bg-card border-t-2 border-border/80 shadow-2xl transition-transform duration-300 z-20 rounded-t-3xl max-h-[50vh] flex flex-col',
          showIngredients ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <button
          className="absolute -top-11 left-1/2 -translate-x-1/2 bg-card border-x-2 border-t-2 border-border/80 px-4 py-1.5 rounded-t-xl flex items-center gap-2 shadow-sm font-bold text-xs sm:text-sm text-emerald-600 hover:bg-emerald-500/10 transition-colors"
          onClick={() => setShowIngredients(!showIngredients)}
        >
          <List className="h-4 w-4" />
          {t.ingredients}
          {showIngredients ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
        <div className="p-4 overflow-y-auto">
          <ul className="space-y-2 max-w-lg mx-auto">
            {recipe.ingredients.map((ing) => (
              <li
                key={ing.item}
                className="flex justify-between items-center text-sm p-2 border-b-2 border-border/40"
              >
                <span className="font-semibold">
                  {translateIngredientName(ing.item, language)}
                </span>
                <span className="text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                  {scaleIngredientAmount(ing.amount, servingMultiplier)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-24 sm:h-28 border-t-2 border-border/60 bg-background flex items-center justify-between px-4 md:px-8 z-30 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 0}
          variant="outline"
          className="h-14 sm:h-16 w-28 sm:w-32 rounded-2xl text-base sm:text-lg font-black gap-1.5 sm:gap-2 active:scale-95 disabled:opacity-50 border-2"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" /> {t.prev}
        </Button>

        {currentStep === recipe.instructions.length - 1 ? (
          <Button
            onClick={handleClose}
            className="h-14 sm:h-16 w-28 sm:w-32 rounded-2xl text-base sm:text-lg font-black gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white active:scale-95 shadow-lg border-2 border-emerald-400"
          >
            {t.done} <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={currentStep === recipe.instructions.length - 1}
            className="h-14 sm:h-16 w-28 sm:w-32 rounded-2xl text-base sm:text-lg font-black gap-1.5 sm:gap-2 active:scale-95 disabled:opacity-50 border-2 bg-foreground text-background hover:bg-foreground/90"
          >
            {t.next} <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        )}
      </div>
    </div>
  )
}

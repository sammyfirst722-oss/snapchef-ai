/**
 * Web Speech API Utility for SnapChef AI
 * Provides client-side, zero-cost, high-fidelity voice read-aloud
 * with adjustable speed (0.5x - 1.5x) and English/Spanish native voice support.
 */

import { Language } from './translations/spanish'

export interface SpeechOptions {
  rate?: number // 0.5 to 1.5+ (Sammy requested down to 0.5x)
  pitch?: number // 0.5 to 2 (default 1.0)
  lang?: Language
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: unknown) => void
}

export const SPEECH_RATES = [0.5, 0.75, 1.0, 1.25, 1.5] as const
export type SpeechRate = typeof SPEECH_RATES[number]

class SpeechManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private voices: SpeechSynthesisVoice[] = []
  private voicesLoaded: boolean = false

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices()
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices()
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    this.voices = window.speechSynthesis.getVoices()
    if (this.voices.length > 0) {
      this.voicesLoaded = true
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  }

  public getAvailableVoices(lang: Language): SpeechSynthesisVoice[] {
    if (!this.voicesLoaded) {
      this.initVoices()
    }
    const prefix = lang === 'es' ? 'es' : 'en'
    return this.voices.filter((v) => v.lang.toLowerCase().startsWith(prefix))
  }

  public getBestVoice(lang: Language): SpeechSynthesisVoice | null {
    const matching = this.getAvailableVoices(lang)
    if (matching.length === 0) return null

    if (lang === 'es') {
      // Prioritize natural Spanish voices (es-US, es-MX, Google, Microsoft, Paulina)
      const preferred = matching.find(
        (v) =>
          v.lang.toLowerCase().includes('es-us') ||
          v.lang.toLowerCase().includes('es-mx') ||
          /google|natural|paulina|monica|jorge/i.test(v.name)
      )
      return preferred || matching[0]
    } else {
      // Prioritize natural English voices (en-US, Google, Samantha, Natural)
      const preferred = matching.find(
        (v) =>
          v.lang.toLowerCase().includes('en-us') &&
          /google|natural|samantha|alex|jenny/i.test(v.name)
      )
      return preferred || matching[0]
    }
  }

  public speak(text: string, options: SpeechOptions = {}): boolean {
    if (!this.isSupported()) {
      options.onError?.(new Error('Speech synthesis not supported in this browser'))
      return false
    }

    // Cancel any ongoing speech immediately
    this.stop()

    const cleanText = text.trim()
    if (!cleanText) return false

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText)
      const lang = options.lang || 'en'
      const rate = options.rate !== undefined ? options.rate : 1.0

      utterance.rate = Math.max(0.5, Math.min(2.0, rate))
      utterance.pitch = options.pitch || 1.0
      utterance.lang = lang === 'es' ? 'es-US' : 'en-US'

      const voice = this.getBestVoice(lang)
      if (voice) {
        utterance.voice = voice
      }

      utterance.onstart = () => {
        options.onStart?.()
      }

      utterance.onend = () => {
        this.currentUtterance = null
        options.onEnd?.()
      }

      utterance.onerror = (e) => {
        // 'interrupted' or 'canceled' are normal when user skips or clicks stop
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech synthesis error:', e)
        }
        this.currentUtterance = null
        options.onError?.(e)
      }

      this.currentUtterance = utterance
      window.speechSynthesis.speak(utterance)
      return true
    } catch (err) {
      console.warn('Failed to initiate speech:', err)
      options.onError?.(err)
      return false
    }
  }

  public pause(): void {
    if (this.isSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
    }
  }

  public resume(): void {
    if (this.isSupported() && window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
  }

  public stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel()
      this.currentUtterance = null
    }
  }

  public isSpeaking(): boolean {
    return this.isSupported() && window.speechSynthesis.speaking
  }

  public isPaused(): boolean {
    return this.isSupported() && window.speechSynthesis.paused
  }
}

export const speechManager = new SpeechManager()

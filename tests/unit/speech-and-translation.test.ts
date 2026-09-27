import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  UI_TRANSLATIONS,
  INGREDIENT_TRANSLATIONS,
  translateIngredientName,
  translateInstructionStep,
} from '@/lib/translations/spanish'
import { speechManager, SPEECH_RATES } from '@/lib/speech-utils'

describe('Spanish Translations', () => {
  it('provides complete UI dictionaries for English and Spanish', () => {
    expect(UI_TRANSLATIONS.en.step).toBe('Step')
    expect(UI_TRANSLATIONS.es.step).toBe('Paso')
    expect(UI_TRANSLATIONS.en.startCooking).toBe('Start Cooking')
    expect(UI_TRANSLATIONS.es.startCooking).toBe('Empezar a Cocinar')
    expect(UI_TRANSLATIONS.es.speed).toBe('Velocidad')
    expect(UI_TRANSLATIONS.es.autoRead).toBe('Lectura Automática')
  })

  it('translates common cooking ingredients correctly', () => {
    expect(translateIngredientName('eggs', 'es')).toBe('huevos')
    expect(translateIngredientName('butter', 'es')).toBe('mantequilla')
    expect(translateIngredientName('cheddar cheese', 'es')).toBe('queso cheddar')
    expect(translateIngredientName('chicken breast', 'es')).toBe('pechuga de pollo')
    expect(translateIngredientName('olive oil', 'es')).toBe('aceite de oliva')
    // English returns original
    expect(translateIngredientName('eggs', 'en')).toBe('eggs')
  })

  it('translates instructions to Spanish with proper verbs and patterns', () => {
    const step1 = 'Melt the butter in a skillet over medium heat'
    expect(translateInstructionStep(step1, 'es')).toContain('Derrite la mantequilla')

    const step2 = 'Whisk the eggs with salt in a bowl'
    expect(translateInstructionStep(step2, 'es')).toContain('Bate los huevos')

    const step3 = 'Cook for 5 minutes'
    expect(translateInstructionStep(step3, 'es')).toBe('Cocina durante 5 minutos')

    const step4 = 'Serve hot and enjoy!'
    expect(translateInstructionStep(step4, 'es')).toContain('¡Sirve caliente y disfruta!')
  })
})

describe('Speech Utils', () => {
  it('supports speed range down to 0.5x as requested by Sammy', () => {
    expect(SPEECH_RATES).toContain(0.5)
    expect(SPEECH_RATES[0]).toBe(0.5)
    expect(SPEECH_RATES).toEqual([0.5, 0.75, 1.0, 1.25, 1.5])
  })

  it('handles speech synthesis lifecycle cleanly', () => {
    // In node/jsdom environment without window.speechSynthesis
    expect(typeof speechManager.isSupported).toBe('function')
    expect(typeof speechManager.speak).toBe('function')
    expect(typeof speechManager.stop).toBe('function')
  })
})

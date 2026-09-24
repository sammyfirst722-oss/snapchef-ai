'use client'

const FRIDGE_ITEMS_KEY = 'snapchef_fridge_items_v1'
const PRO_STATUS_KEY = 'snapchef_pro_status_v1'
const SCAN_COUNT_KEY = 'snapchef_scan_count_v1'
const DIET_PREF_KEY = 'snapchef_diet_pref_v1'

export interface DietPreferences {
  highProtein: boolean
  keto: boolean
  under15Min: boolean
  budget: boolean
  vegetarian: boolean
}

export function getFridgeItems(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(FRIDGE_ITEMS_KEY)
    return raw ? JSON.parse(raw) : ['chicken', 'eggs', 'garlic', 'cheese', 'pasta']
  } catch {
    return ['chicken', 'eggs', 'garlic', 'cheese', 'pasta']
  }
}

export function saveFridgeItems(items: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(FRIDGE_ITEMS_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event('snapchef_fridge_changed'))
  } catch (err) {
    console.error(err)
  }
}

export function addFridgeItems(newItems: string[]) {
  const current = getFridgeItems()
  const cleanNew = newItems
    .map((i) => i.trim().toLowerCase())
    .filter((i) => i && !current.includes(i))
  
  if (cleanNew.length > 0) {
    const updated = [...current, ...cleanNew]
    saveFridgeItems(updated)
    return cleanNew.length
  }
  return 0
}

export function toggleFridgeItem(item: string) {
  const clean = item.trim().toLowerCase()
  if (!clean) return
  const current = getFridgeItems()
  const updated = current.includes(clean)
    ? current.filter((i) => i !== clean)
    : [...current, clean]
  saveFridgeItems(updated)
}

export function clearFridgeItems() {
  saveFridgeItems([])
}

// Pro Status
export function isUserPro(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(PRO_STATUS_KEY) === 'true'
  } catch {
    return false
  }
}

export function setUserPro(isPro: boolean) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PRO_STATUS_KEY, isPro ? 'true' : 'false')
    window.dispatchEvent(new Event('snapchef_pro_changed'))
  } catch (err) {
    console.error(err)
  }
}

// Daily Scan Counter
export function getDailyScanCount(): { count: number; date: string; maxFree: number } {
  const maxFree = 3
  const today = new Date().toISOString().split('T')[0]
  if (typeof window === 'undefined') return { count: 0, date: today, maxFree }

  try {
    const raw = localStorage.getItem(SCAN_COUNT_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.date === today) {
        return { count: parsed.count, date: today, maxFree }
      }
    }
    // New day or uninitialized
    return { count: 0, date: today, maxFree }
  } catch {
    return { count: 0, date: today, maxFree }
  }
}

export function incrementScanCount(): boolean {
  if (isUserPro()) return true // Unlimited for Pro

  const { count, date, maxFree } = getDailyScanCount()
  if (count >= maxFree) return false

  try {
    localStorage.setItem(
      SCAN_COUNT_KEY,
      JSON.stringify({ count: count + 1, date })
    )
    window.dispatchEvent(new Event('snapchef_scan_changed'))
    return true
  } catch {
    return false
  }
}

// Dietary Preferences
export function getDietPreferences(): DietPreferences {
  const defaults: DietPreferences = {
    highProtein: false,
    keto: false,
    under15Min: false,
    budget: false,
    vegetarian: false,
  }
  if (typeof window === 'undefined') return defaults

  try {
    const raw = localStorage.getItem(DIET_PREF_KEY)
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
  } catch {
    return defaults
  }
}

export function saveDietPreferences(pref: DietPreferences) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DIET_PREF_KEY, JSON.stringify(pref))
    window.dispatchEvent(new Event('snapchef_diet_changed'))
  } catch (err) {
    console.error(err)
  }
}

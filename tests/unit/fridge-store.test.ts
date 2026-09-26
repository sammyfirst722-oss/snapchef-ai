import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getFridgeItems,
  saveFridgeItems,
  addFridgeItems,
  toggleFridgeItem,
  clearFridgeItems,
  isUserPro,
  setUserPro,
  getDailyScanCount,
  incrementScanCount,
  getDietPreferences,
  saveDietPreferences,
} from '@/lib/fridge-store'

describe('lib/fridge-store.ts Unit Tests', () => {
  let mockStorage: Record<string, string> = {}
  let eventDispatched: string[] = []

  const setupClientEnvironment = () => {
    mockStorage = {}
    eventDispatched = []

    const mockLocalStorage = {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, val: string) => {
        mockStorage[key] = val
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key]
      }),
      clear: vi.fn(() => {
        mockStorage = {}
      }),
    }

    const mockWindow = {
      dispatchEvent: vi.fn((evt: Event) => {
        eventDispatched.push(evt.type)
        return true
      }),
    }

    vi.stubGlobal('localStorage', mockLocalStorage)
    vi.stubGlobal('window', mockWindow)
    vi.stubGlobal('Event', class MockEvent {
      type: string
      constructor(type: string) {
        this.type = type
      }
    })
  }

  beforeEach(() => {
    setupClientEnvironment()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('Pro Status & Entitlements', () => {
    it('defaults to false for unauthenticated / unupgraded users', () => {
      expect(isUserPro()).toBe(false)
    })

    it('sets pro status and dispatches snapchef_pro_changed event', () => {
      setUserPro(true)
      expect(mockStorage['snapchef_pro_status_v1']).toBe('true')
      expect(isUserPro()).toBe(true)
      expect(eventDispatched).toContain('snapchef_pro_changed')

      setUserPro(false)
      expect(mockStorage['snapchef_pro_status_v1']).toBe('false')
      expect(isUserPro()).toBe(false)
    })

    it('handles localStorage errors gracefully without throwing', () => {
      vi.mocked(localStorage.getItem).mockImplementationOnce(() => {
        throw new Error('Storage access denied')
      })
      expect(isUserPro()).toBe(false)
    })
  })

  describe('Daily Scan Counter and Quotas', () => {
    const today = new Date().toISOString().split('T')[0]

    it('initializes daily scan count to 0 with maxFree = 3', () => {
      const { count, date, maxFree } = getDailyScanCount()
      expect(count).toBe(0)
      expect(date).toBe(today)
      expect(maxFree).toBe(3)
    })

    it('increments scan count for free users up to maxFree limit', () => {
      // 1st scan
      const first = incrementScanCount()
      expect(first).toBe(true)
      expect(getDailyScanCount().count).toBe(1)
      expect(eventDispatched).toContain('snapchef_scan_changed')

      // 2nd scan
      const second = incrementScanCount()
      expect(second).toBe(true)
      expect(getDailyScanCount().count).toBe(2)

      // 3rd scan
      const third = incrementScanCount()
      expect(third).toBe(true)
      expect(getDailyScanCount().count).toBe(3)

      // 4th scan should be blocked
      const fourth = incrementScanCount()
      expect(fourth).toBe(false)
      expect(getDailyScanCount().count).toBe(3)
    })

    it('resets count when saved date is in the past (daily rollover)', () => {
      mockStorage['snapchef_scan_count_v1'] = JSON.stringify({
        count: 3,
        date: '2026-01-01',
      })

      const status = getDailyScanCount()
      expect(status.count).toBe(0)
      expect(status.date).toBe(today)

      // New day allows incrementing again
      const allowed = incrementScanCount()
      expect(allowed).toBe(true)
      expect(getDailyScanCount().count).toBe(1)
    })

    it('allows unlimited scans for Pro users without quota restriction', () => {
      setUserPro(true)
      mockStorage['snapchef_scan_count_v1'] = JSON.stringify({
        count: 10,
        date: today,
      })

      // Pro users always return true and are never blocked
      expect(incrementScanCount()).toBe(true)
    })
  })

  describe('Fridge Items Store', () => {
    it('returns default starter items when uninitialized', () => {
      const items = getFridgeItems()
      expect(items).toEqual(['chicken', 'eggs', 'garlic', 'cheese', 'pasta'])
    })

    it('saves items and emits snapchef_fridge_changed event', () => {
      saveFridgeItems(['salmon', 'asparagus'])
      expect(getFridgeItems()).toEqual(['salmon', 'asparagus'])
      expect(eventDispatched).toContain('snapchef_fridge_changed')
    })

    it('adds new items with trimming and lowercase normalization, preventing duplicates', () => {
      saveFridgeItems(['milk', 'eggs'])

      const added = addFridgeItems(['  MILK ', 'Butter ', 'garlic'])
      expect(added).toBe(2) // Butter and garlic added; MILK was duplicate
      expect(getFridgeItems()).toEqual(['milk', 'eggs', 'butter', 'garlic'])
    })

    it('toggles existing items off and new items on', () => {
      saveFridgeItems(['tofu', 'rice'])

      // Toggle off existing item
      toggleFridgeItem('tofu')
      expect(getFridgeItems()).toEqual(['rice'])

      // Toggle on new item
      toggleFridgeItem('soy sauce')
      expect(getFridgeItems()).toEqual(['rice', 'soy sauce'])

      // Ignore whitespace-only toggle
      toggleFridgeItem('   ')
      expect(getFridgeItems()).toEqual(['rice', 'soy sauce'])
    })

    it('clears all fridge items', () => {
      saveFridgeItems(['beef', 'carrots'])
      clearFridgeItems()
      expect(getFridgeItems()).toEqual([])
    })
  })

  describe('Diet Preferences Store', () => {
    it('returns default diet preferences (all false)', () => {
      const prefs = getDietPreferences()
      expect(prefs).toEqual({
        highProtein: false,
        keto: false,
        under15Min: false,
        budget: false,
        vegetarian: false,
      })
    })

    it('saves diet preferences and dispatches snapchef_diet_changed', () => {
      saveDietPreferences({
        highProtein: true,
        keto: false,
        under15Min: true,
        budget: false,
        vegetarian: false,
      })

      const loaded = getDietPreferences()
      expect(loaded.highProtein).toBe(true)
      expect(loaded.under15Min).toBe(true)
      expect(eventDispatched).toContain('snapchef_diet_changed')
    })
  })
})

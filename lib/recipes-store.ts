'use client'

const FAVORITES_STORAGE_KEY = 'pb_favorite_recipes_v1'
const LIKES_STORAGE_KEY = 'pb_liked_recipes_v1'

export function getFavoriteRecipeIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function isRecipeFavorite(id: string): boolean {
  return getFavoriteRecipeIds().includes(id)
}

export function toggleFavoriteRecipe(id: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const current = getFavoriteRecipeIds()
    let updated: string[]
    let nowSaved = false
    if (current.includes(id)) {
      updated = current.filter((item) => item !== id)
      nowSaved = false
    } else {
      updated = [id, ...current]
      nowSaved = true
    }
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('pb_recipe_favorites_changed'))
    return nowSaved
  } catch {
    return false
  }
}

export function getLikedRecipeIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LIKES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function isRecipeLiked(id: string): boolean {
  return getLikedRecipeIds().includes(id)
}

export function toggleLikeRecipe(id: string): { isLiked: boolean; delta: number } {
  if (typeof window === 'undefined') return { isLiked: false, delta: 0 }
  try {
    const current = getLikedRecipeIds()
    let updated: string[]
    let isLiked = false
    let delta = 0
    if (current.includes(id)) {
      updated = current.filter((item) => item !== id)
      isLiked = false
      delta = -1
    } else {
      updated = [id, ...current]
      isLiked = true
      delta = 1
    }
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('pb_recipe_likes_changed'))
    return { isLiked, delta }
  } catch {
    return { isLiked: false, delta: 0 }
  }
}

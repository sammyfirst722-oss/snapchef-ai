'use client'

import { BookOpen, Camera, Heart, Refrigerator, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useHaptics } from '@/hooks/use-haptics'

interface MobileNavProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  onScanClick: () => void
  onOpenProModal: () => void
  savedCount?: number
}

export function MobileNav({
  activeTab = 'fridge',
  onTabChange,
  onScanClick,
  onOpenProModal,
  savedCount = 0,
}: MobileNavProps) {
  const haptic = useHaptics()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t-2 border-border/80 px-2 py-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-xl shadow-black/10">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Fridge Tab */}
        <button
          type="button"
          onClick={() => { haptic('light'); onTabChange?.('fridge'); }}
          className={cn(
            'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-90',
            activeTab === 'fridge'
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Refrigerator className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-medium leading-tight">Fridge</span>
        </button>

        {/* Recipes Tab */}
        <button
          type="button"
          onClick={() => { haptic('light'); onTabChange?.('recipes'); }}
          className={cn(
            'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-90',
            activeTab === 'recipes'
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <BookOpen className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-medium leading-tight">Recipes</span>
        </button>

        {/* Center Camera Scan Action */}
        <button
          type="button"
          onClick={() => { haptic('heavy'); onScanClick(); }}
          className="flex flex-col items-center justify-center -mt-5 group select-none"
          aria-label="Scan Fridge"
        >
          <div className={cn(
            "h-13 w-13 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 transition-transform active:scale-95 group-hover:scale-105 border-2 border-white/20",
            activeTab === 'scan' ? 'ring-4 ring-emerald-500 scale-105' : 'ring-4 ring-background'
          )}>
            <Camera className="h-6 w-6 drop-shadow-xs" />
          </div>
          <span className={cn(
            "text-[10px] font-black mt-1",
            activeTab === 'scan' ? 'text-emerald-500 font-black underline' : 'text-emerald-600 dark:text-emerald-400'
          )}>Scan</span>
        </button>

        {/* Saved Favorites Tab */}
        <button
          type="button"
          onClick={() => { haptic('light'); onTabChange?.('saved'); }}
          className={cn(
            'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-90 relative',
            activeTab === 'saved'
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Heart className="h-5 w-5 mb-0.5" />
          {savedCount > 0 && (
            <span className="absolute top-1 right-2 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
              {savedCount}
            </span>
          )}
          <span className="text-[10px] font-medium leading-tight">Saved</span>
        </button>

        {/* Pro VIP Tab */}
        <button
          type="button"
          onClick={() => { haptic('medium'); onOpenProModal(); }}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-90 text-amber-500 hover:text-amber-600"
        >
          <Zap className="h-5 w-5 mb-0.5 fill-amber-500" />
          <span className="text-[10px] font-black leading-tight">Pro</span>
        </button>
      </div>
    </nav>
  )
}

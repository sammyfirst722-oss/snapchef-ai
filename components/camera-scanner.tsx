'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Camera,
  Upload,
  Sparkles,
  Check,
  X,
  Plus,
  RefreshCw,
  ScanLine,
  Zap,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react'
import {
  addFridgeItems,
  getDailyScanCount,
  incrementScanCount,
  isUserPro,
} from '@/lib/fridge-store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CameraScannerProps {
  onIngredientsAdded?: () => void
  onOpenProModal?: () => void
}

export function CameraScanner({ onIngredientsAdded, onOpenProModal }: CameraScannerProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [detectedItems, setDetectedItems] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [customItem, setCustomItem] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const isPro = isUserPro()
  const { count, maxFree } = getDailyScanCount()
  const remainingScans = Math.max(0, maxFree - count)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check scan limits for free users
    if (!isPro && remainingScans <= 0) {
      toast.error('You reached your 3 free scans for today!', {
        description: 'Upgrade to SnapChef Pro for unlimited camera scans.',
        action: {
          label: 'Get Pro',
          onClick: () => onOpenProModal && onOpenProModal(),
        },
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setImagePreview(base64)
      processImage(base64, file.type)
    }
    reader.readAsDataURL(file)
  }

  const processImage = async (base64: string, mimeType: string) => {
    setIsScanning(true)
    setDetectedItems([])
    setSelectedItems([])

    try {
      // Simulate scan delay for natural UX
      const [res] = await Promise.all([
        fetch('/api/scan-fridge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType }),
        }),
        new Promise((resolve) => setTimeout(resolve, 1500)), // realistic scan animation
      ])

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to scan image')
      }

      const items: string[] = data.ingredients || []
      setDetectedItems(items)
      setSelectedItems(items) // Select all by default
      incrementScanCount()

      toast.success(`Detected ${items.length} ingredients! 📸`, {
        description: 'Review and add them to your fridge inventory.',
      })
    } catch (err: any) {
      console.error(err)
      toast.error('Scan failed', { description: err.message || 'Please try another photo' })
    } finally {
      setIsScanning(false)
    }
  }

  const toggleSelectedItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const handleAddAll = () => {
    if (selectedItems.length === 0) {
      toast.info('No items selected to add')
      return
    }

    const added = addFridgeItems(selectedItems)
    toast.success(`Added ${added} items to your fridge! 🍳`)
    if (onIngredientsAdded) {
      onIngredientsAdded()
    }

    // Reset scanner
    setImagePreview(null)
    setDetectedItems([])
    setSelectedItems([])
  }

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = customItem.trim().toLowerCase()
    if (!clean) return
    if (!detectedItems.includes(clean)) {
      setDetectedItems((prev) => [...prev, clean])
      setSelectedItems((prev) => [...prev, clean])
    }
    setCustomItem('')
  }

  const resetScan = () => {
    setImagePreview(null)
    setDetectedItems([])
    setSelectedItems([])
  }

  return (
    <Card className="border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-500/5 to-transparent overflow-hidden shadow-lg rounded-3xl">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg font-black tracking-tight flex items-center gap-2">
                Snap Your Fridge
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.2 shadow-xs">
                  AI Vision
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Photograph your open fridge or pantry to auto-detect ingredients
              </CardDescription>
            </div>
          </div>

          {/* Daily scan quota pill */}
          <div className="text-right shrink-0">
            {isPro ? (
              <Badge className="bg-amber-400 text-amber-950 font-bold border-2 border-amber-500 text-[10px] gap-1 shadow-2xs">
                <Zap className="h-3 w-3 fill-amber-950" />
                Unlimited Pro
              </Badge>
            ) : (
              <button
                type="button"
                onClick={onOpenProModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border-2 border-border/80 bg-background hover:border-amber-400 text-muted-foreground hover:text-amber-600 transition-colors shadow-2xs"
              >
                <span>{remainingScans}/3 Free Scans</span>
                <span className="text-amber-500 font-extrabold">Upgrade ⭐</span>
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-4">
        {/* Hidden File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Viewfinder / Capture Area */}
        {!imagePreview ? (
          <div className="border-2 border-dashed border-emerald-500/50 rounded-2xl p-6 md:p-8 text-center bg-card/60 hover:bg-emerald-500/5 transition-colors flex flex-col items-center justify-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <ScanLine className="h-7 w-7 animate-pulse" />
            </div>

            <div>
              <h4 className="font-extrabold text-sm md:text-base text-foreground">
                Take a Photo of Your Ingredients
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-0.5 leading-relaxed">
                Snap shelves, leftovers, or fresh produce. Our AI detects everything in seconds!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full max-w-xs">
              <Button
                type="button"
                size="sm"
                className="flex-1 gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
                <span>Open Camera</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-2 font-bold border-2 border-border/80 hover:border-emerald-500 shadow-2xs active:scale-95"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Upload</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Image Preview & Scan Results View */
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border-2 border-border/80 max-h-64 bg-black flex items-center justify-center shadow-md">
              <img
                src={imagePreview}
                alt="Fridge capture"
                className={cn(
                  'w-full max-h-64 object-cover transition-opacity duration-300',
                  isScanning ? 'opacity-70 blur-[1px]' : 'opacity-100'
                )}
              />

              {/* Animated Laser Scanning Line */}
              {isScanning && (
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />
                  <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-xs">
                    <div className="px-4 py-2 rounded-full bg-black/80 text-white text-xs font-bold border border-emerald-400/50 flex items-center gap-2 shadow-lg">
                      <RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" />
                      <span>AI Detecting Ingredients...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reset snapshot button */}
              {!isScanning && (
                <button
                  type="button"
                  onClick={resetScan}
                  className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Detected Items Pill List */}
            {detectedItems.length > 0 && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                    Detected Ingredients ({selectedItems.length}/{detectedItems.length}):
                  </span>
                  <span className="text-[11px] text-muted-foreground italic">
                    Tap to toggle
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {detectedItems.map((item) => {
                    const isSelected = selectedItems.includes(item)
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleSelectedItem(item)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border-2 active:scale-95 shadow-2xs',
                          isSelected
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20'
                            : 'bg-card text-muted-foreground border-border/80 hover:border-emerald-500/50'
                        )}
                      >
                        {isSelected ? (
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        ) : (
                          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span>{item}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Add Custom ingredient input */}
                <form onSubmit={handleAddCustom} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customItem}
                    onChange={(e) => setCustomItem(e.target.value)}
                    placeholder="Missed anything? Add item (e.g. soy sauce)..."
                    className="flex-1 h-9 rounded-xl border-2 border-border/80 bg-background px-3 text-xs focus:outline-hidden focus:border-emerald-500"
                  />
                  <Button type="submit" size="sm" variant="outline" className="h-9 px-3 border-2 font-bold text-xs">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add
                  </Button>
                </form>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleAddAll}
                    disabled={selectedItems.length === 0}
                    className="flex-1 gap-2 font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md text-xs md:text-sm h-10 rounded-xl active:scale-98"
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Add {selectedItems.length} Items to Fridge Inventory</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={resetScan}
                    className="h-10 w-10 shrink-0 border-2 rounded-xl"
                    title="Retake photo"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

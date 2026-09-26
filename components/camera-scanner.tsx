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
  Images,
  Trash2,
} from 'lucide-react'
import {
  addFridgeItems,
  getDailyScanCount,
  incrementScanCount,
  isUserPro,
} from '@/lib/fridge-store'
import { compressImage } from '@/lib/image-compress'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CameraScannerProps {
  onIngredientsAdded?: () => void
  onOpenProModal?: () => void
}

interface PhotoItem {
  id: string
  dataUrl: string
  base64: string
  mimeType: string
  sizeKb: number
}

export function CameraScanner({ onIngredientsAdded, onOpenProModal }: CameraScannerProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [isCompressing, setIsCompressing] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [detectedItems, setDetectedItems] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [customItem, setCustomItem] = useState('')

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const isPro = isUserPro()
  const { count, maxFree } = getDailyScanCount()
  const remainingScans = Math.max(0, maxFree - count)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

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

    const remainingSlots = 5 - photos.length
    if (remainingSlots <= 0) {
      toast.info('Maximum 5 photos reached per scan')
      return
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots)
    setIsCompressing(true)

    try {
      const processed: PhotoItem[] = []
      for (const file of filesToProcess) {
        const comp = await compressImage(file, 1280, 0.8)
        processed.push({
          id: Math.random().toString(36).substring(2, 9),
          dataUrl: comp.dataUrl,
          base64: comp.base64,
          mimeType: comp.mimeType,
          sizeKb: Math.round(comp.sizeBytes / 1024),
        })
      }

      setPhotos((prev) => {
        const updated = [...prev, ...processed]
        setActivePhotoIndex(updated.length - 1)
        return updated
      })

      // Reset any previous scan results when new photos are added
      setDetectedItems([])
      setSelectedItems([])

      toast.success(
        processed.length === 1
          ? `Photo compressed & added (${processed[0].sizeKb} KB) 📸`
          : `${processed.length} photos added! 📸`
      )
    } catch (err: any) {
      console.error('Image compression error:', err)
      toast.error('Could not process photo: ' + (err.message || 'Unknown error'))
    } finally {
      setIsCompressing(false)
      if (cameraInputRef.current) cameraInputRef.current.value = ''
      if (galleryInputRef.current) galleryInputRef.current.value = ''
    }
  }

  const removePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id)
      if (activePhotoIndex >= filtered.length) {
        setActivePhotoIndex(Math.max(0, filtered.length - 1))
      }
      return filtered
    })
    setDetectedItems([])
    setSelectedItems([])
  }

  const triggerScan = async () => {
    if (photos.length === 0) {
      toast.error('Please add at least one photo first')
      return
    }

    setIsScanning(true)
    setDetectedItems([])
    setSelectedItems([])

    try {
      const payload = {
        images: photos.map((p) => ({
          imageBase64: p.base64,
          mimeType: p.mimeType,
        })),
      }

      const [res] = await Promise.all([
        fetch('/api/scan-fridge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
        new Promise((resolve) => setTimeout(resolve, 1400)), // natural scanning animation
      ])

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to scan image')
      }

      const items: string[] = data.ingredients || []
      setDetectedItems(items)
      setSelectedItems(items) // Select all detected by default
      incrementScanCount()

      toast.success(
        items.length > 0
          ? `Detected ${items.length} ingredients across ${photos.length} photo${photos.length > 1 ? 's' : ''}! 🍳`
          : 'Scan complete! Review your items.',
        {
          description: 'Review and add them to your fridge inventory.',
        }
      )
    } catch (err: any) {
      console.error('Scan error:', err)
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
    setPhotos([])
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

  const resetAll = () => {
    setPhotos([])
    setDetectedItems([])
    setSelectedItems([])
  }

  const currentPreview = photos[activePhotoIndex] || photos[0]

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
                Snap shelves, drawers, or pantry — up to 5 photos per scan
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
        {/* 1. Camera Input (forces mobile camera shutter where supported) */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        {/* 2. Gallery / Multi-Photo Upload Input */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        {/* Viewfinder / Capture Area: When NO photos added */}
        {photos.length === 0 ? (
          <div className="border-2 border-dashed border-emerald-500/50 rounded-2xl p-6 md:p-8 text-center bg-card/60 hover:bg-emerald-500/5 transition-colors flex flex-col items-center justify-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <ScanLine className="h-7 w-7 animate-pulse" />
            </div>

            <div>
              <h4 className="font-extrabold text-sm md:text-base text-foreground">
                Photograph Your Ingredients
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-0.5 leading-relaxed">
                Snap multiple shelves, produce drawers, or pantry items. Our AI scans everything together!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full max-w-xs">
              <Button
                type="button"
                size="sm"
                disabled={isCompressing}
                className="flex-1 gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 h-10"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
                <span>Take Photo</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isCompressing}
                className="flex-1 gap-2 font-bold border-2 border-border/80 hover:border-emerald-500 shadow-2xs active:scale-95 h-10"
                onClick={() => galleryInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Upload Photos</span>
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground italic pt-1">
              Supports up to 5 photos per scan (auto-compressed on device)
            </p>
          </div>
        ) : (
          /* Multi-Photo View & Scan Workspace */
          <div className="space-y-4">
            {/* Active Photo Preview */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-border/80 max-h-64 bg-black flex items-center justify-center shadow-md">
              {currentPreview && (
                <img
                  src={currentPreview.dataUrl}
                  alt={`Fridge shelf ${activePhotoIndex + 1}`}
                  className={cn(
                    'w-full max-h-64 object-cover transition-opacity duration-300',
                    isScanning ? 'opacity-70 blur-[1px]' : 'opacity-100'
                  )}
                />
              )}

              {/* Photo Counter Pill */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm border border-white/20">
                Photo {activePhotoIndex + 1} of {photos.length} ({currentPreview?.sizeKb} KB)
              </div>

              {/* Animated Laser Scanning Line */}
              {isScanning && (
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />
                  <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-xs">
                    <div className="px-4 py-2 rounded-full bg-black/85 text-white text-xs font-bold border border-emerald-400/50 flex items-center gap-2 shadow-lg">
                      <RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" />
                      <span>Scanning {photos.length} Photo{photos.length > 1 ? 's' : ''} with AI...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reset / Clear All button */}
              {!isScanning && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all active:scale-90"
                  title="Remove all photos"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Thumbnail Strip & "+ Add Another Photo" Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
              {photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={cn(
                    'relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border-2 cursor-pointer transition-all',
                    idx === activePhotoIndex
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md scale-102'
                      : 'border-border/80 opacity-70 hover:opacity-100'
                  )}
                >
                  <img
                    src={photo.dataUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {!isScanning && (
                    <button
                      type="button"
                      onClick={(e) => removePhoto(photo.id, e)}
                      className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Remove this photo"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  )}
                  <span className="absolute bottom-0.5 left-0.5 px-1 rounded bg-black/70 text-white text-[8px] font-bold">
                    #{idx + 1}
                  </span>
                </div>
              ))}

              {/* Add Photo Slot (if under 5 photos) */}
              {photos.length < 5 && !isScanning && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isCompressing}
                    className="h-16 w-16 rounded-xl border-2 border-dashed border-emerald-500/60 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex flex-col items-center justify-center gap-1 transition-colors active:scale-95"
                    title="Take another photo"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="text-[9px] font-bold">+ Snap</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isCompressing}
                    className="h-16 w-16 rounded-xl border-2 border-dashed border-border/80 bg-card hover:border-emerald-500 text-muted-foreground hover:text-emerald-600 flex flex-col items-center justify-center gap-1 transition-colors active:scale-95"
                    title="Upload more photos"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-[9px] font-bold">+ File</span>
                  </button>
                </div>
              )}
            </div>

            {/* Big Action Button to Trigger AI Scan */}
            {detectedItems.length === 0 && !isScanning && (
              <Button
                type="button"
                onClick={triggerScan}
                disabled={isScanning || isCompressing}
                className="w-full gap-2 font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md text-sm h-11 rounded-xl active:scale-98"
              >
                <Sparkles className="h-4 w-4 text-emerald-200" />
                <span>
                  Scan {photos.length} Photo{photos.length > 1 ? 's' : ''} with AI Vision
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            {/* Detected Items Pill List */}
            {detectedItems.length > 0 && (
              <div className="space-y-3 pt-2">
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
                    className="flex-1 gap-2 font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md text-xs md:text-sm h-11 rounded-xl active:scale-98"
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Add {selectedItems.length} Items to Fridge Inventory</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={resetAll}
                    className="h-11 w-11 shrink-0 border-2 rounded-xl"
                    title="Scan new photos"
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

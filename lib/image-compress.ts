/**
 * SnapChef AI - Client-Side Image Resizer & Compressor
 * 
 * Compresses large mobile smartphone photos (10MB-25MB) down to ~150KB-250KB in the browser.
 * Ensures image payloads stay well under Vercel's strict 4.5MB serverless limit and
 * speeds up AI vision inference on OpenRouter.
 */

export interface CompressedImageResult {
  dataUrl: string
  base64: string
  mimeType: string
  width: number
  height: number
  sizeBytes: number
}

export async function compressImage(
  file: File,
  maxDimension: number = 1280,
  quality: number = 0.8
): Promise<CompressedImageResult> {
  if (typeof window === 'undefined') {
    throw new Error('compressImage must run in a browser environment')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string
      if (!rawDataUrl) {
        return reject(new Error('Empty image data'))
      }

      const img = new Image()
      img.onerror = () => reject(new Error('Failed to decode image data'))
      img.onload = () => {
        try {
          let { width, height } = img

          // Calculate aspect-ratio-preserving dimensions
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width)
              width = maxDimension
            } else {
              width = Math.round((width * maxDimension) / height)
              height = maxDimension
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            // Fallback to uncompressed dataUrl if canvas context is unavailable
            const commaIndex = rawDataUrl.indexOf(',')
            const base64 = commaIndex !== -1 ? rawDataUrl.slice(commaIndex + 1) : rawDataUrl
            return resolve({
              dataUrl: rawDataUrl,
              base64,
              mimeType: file.type || 'image/jpeg',
              width: img.width,
              height: img.height,
              sizeBytes: file.size,
            })
          }

          // Optional: smoother image downsampling
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)

          const mimeType = 'image/jpeg'
          const compressedDataUrl = canvas.toDataURL(mimeType, quality)
          const commaIndex = compressedDataUrl.indexOf(',')
          const base64 = commaIndex !== -1 ? compressedDataUrl.slice(commaIndex + 1) : compressedDataUrl

          // Calculate approximate byte size of base64
          const sizeBytes = Math.round((base64.length * 3) / 4)

          resolve({
            dataUrl: compressedDataUrl,
            base64,
            mimeType,
            width,
            height,
            sizeBytes,
          })
        } catch (err) {
          reject(err)
        }
      }

      img.src = rawDataUrl
    }

    reader.readAsDataURL(file)
  })
}

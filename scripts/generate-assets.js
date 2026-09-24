const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const publicDir = path.join(__dirname, '..', 'public')
const iconsDir = path.join(publicDir, 'icons')

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true })

// SVG Icon Template
function createIconSvg(size, maskable = false) {
  const pad = maskable ? size * 0.15 : 0
  const innerSize = size - pad * 2
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#052e16"/>
        <stop offset="50%" stop-color="#047857"/>
        <stop offset="100%" stop-color="#10b981"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="${size}" height="${size}" rx="${maskable ? 0 : size * 0.22}" fill="url(#bg)"/>
    
    <!-- Outer decorative ring -->
    <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.42}" fill="none" stroke="#34d399" stroke-width="${size * 0.015}" stroke-dasharray="10 5" opacity="0.4"/>
    
    <g transform="translate(${pad}, ${pad}) scale(${innerSize / 100})">
      <!-- Chef Hat Base -->
      <path d="M 28 65 C 28 62 32 60 50 60 C 68 60 72 62 72 65 L 70 76 C 70 78 68 80 50 80 C 32 80 30 78 30 76 Z" fill="#ffffff" filter="url(#glow)"/>
      <path d="M 32 68 L 68 68" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
      
      <!-- Chef Hat Top / Puffs -->
      <path d="M 28 62 C 18 58 18 42 30 38 C 28 26 44 20 50 28 C 58 18 74 24 72 38 C 82 42 82 58 72 62 Z" fill="#ffffff" filter="url(#glow)"/>
      
      <!-- Camera Lens / Radar in Chef Hat -->
      <circle cx="50" cy="46" r="13" fill="#064e3b" stroke="url(#gold)" stroke-width="2.5"/>
      <circle cx="50" cy="46" r="8" fill="#047857"/>
      <circle cx="50" cy="46" r="4" fill="#34d399"/>
      
      <!-- Sparkles / Stars -->
      <path d="M 76 22 L 78 28 L 84 30 L 78 32 L 76 38 L 74 32 L 68 30 L 74 28 Z" fill="url(#gold)"/>
      <path d="M 24 30 L 25 34 L 29 35 L 25 36 L 24 40 L 23 36 L 19 35 L 23 34 Z" fill="url(#gold)"/>
    </g>
  </svg>
  `
}

// Google Play Feature Graphic (1024x500)
function createFeatureGraphicSvg() {
  return `
  <svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#022c22"/>
        <stop offset="40%" stop-color="#064e3b"/>
        <stop offset="100%" stop-color="#047857"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#10b981"/>
        <stop offset="100%" stop-color="#34d399"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.4"/>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="1024" height="500" fill="url(#fbg)"/>
    
    <!-- Grid overlay pattern -->
    <g opacity="0.07" stroke="#ffffff" stroke-width="1">
      <line x1="0" y1="100" x2="1024" y2="100"/>
      <line x1="0" y1="200" x2="1024" y2="200"/>
      <line x1="0" y1="300" x2="1024" y2="300"/>
      <line x1="0" y1="400" x2="1024" y2="400"/>
      <line x1="200" y1="0" x2="200" y2="500"/>
      <line x1="400" y1="0" x2="400" y2="500"/>
      <line x1="600" y1="0" x2="600" y2="500"/>
      <line x1="800" y1="0" x2="800" y2="500"/>
    </g>
    
    <!-- Left: App Logo & Branding -->
    <g transform="translate(60, 70)">
      <!-- App Icon Badge -->
      <g filter="url(#shadow)">
        <rect width="110" height="110" rx="24" fill="url(#accent)"/>
        <!-- Inner mini icon -->
        <circle cx="55" cy="55" r="32" fill="#064e3b"/>
        <circle cx="55" cy="55" r="18" fill="#10b981"/>
        <circle cx="55" cy="55" r="8" fill="#ffffff"/>
      </g>
      
      <!-- Headline -->
      <text x="135" y="60" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="-1">
        SnapChef <tspan fill="#34d399">AI</tspan>
      </text>
      <text x="135" y="98" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="20" fill="url(#gold)" letter-spacing="1">
        SMART FRIDGE SCANNER &amp; CHEF
      </text>
      
      <!-- Subheadline -->
      <text x="0" y="180" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="34" fill="#ffffff">
        Snap Your Fridge. Cook in 15 Mins.
      </text>
      <text x="0" y="220" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="19" fill="#a7f3d0">
        Turn leftover ingredients into gourmet meals with instant AI camera vision.
      </text>
      
      <!-- Feature Pills -->
      <g transform="translate(0, 260)">
        <!-- Pill 1 -->
        <rect x="0" y="0" width="180" height="42" rx="21" fill="#047857" stroke="#10b981" stroke-width="2"/>
        <text x="90" y="26" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#ffffff" text-anchor="middle">
          📸 Camera AI Scan
        </text>
        
        <!-- Pill 2 -->
        <rect x="195" y="0" width="165" height="42" rx="21" fill="#047857" stroke="#10b981" stroke-width="2"/>
        <text x="277" y="26" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#ffffff" text-anchor="middle">
          🍲 110+ Recipes
        </text>
        
        <!-- Pill 3 -->
        <rect x="375" y="0" width="185" height="42" rx="21" fill="#047857" stroke="#10b981" stroke-width="2"/>
        <text x="467" y="26" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#ffffff" text-anchor="middle">
          ✨ Leftover Chef
        </text>
      </g>
    </g>
    
    <!-- Right: Mockup Card Illustration -->
    <g transform="translate(680, 50)" filter="url(#shadow)">
      <!-- Phone Mockup Container -->
      <rect x="0" y="0" width="280" height="400" rx="30" fill="#0f172a" stroke="#34d399" stroke-width="3"/>
      <!-- Screen Header -->
      <rect x="20" y="24" width="240" height="40" rx="12" fill="#1e293b"/>
      <text x="35" y="50" font-family="sans-serif" font-weight="700" font-size="14" fill="#34d399">SnapChef Scanner</text>
      <!-- Radar scan area -->
      <rect x="20" y="75" width="240" height="180" rx="16" fill="#022c22" stroke="#10b981" stroke-width="2"/>
      <line x1="20" y1="165" x2="260" y2="165" stroke="#34d399" stroke-width="3"/>
      <circle cx="140" cy="165" r="40" fill="none" stroke="#34d399" stroke-width="1.5" stroke-dasharray="6 4"/>
      <text x="140" y="240" font-family="sans-serif" font-weight="600" font-size="12" fill="#6ee7b7" text-anchor="middle">Scanning 6 Fresh Ingredients...</text>
      <!-- Detected ingredients tags -->
      <rect x="20" y="270" width="70" height="24" rx="12" fill="#10b981"/>
      <text x="55" y="286" font-family="sans-serif" font-weight="700" font-size="11" fill="#022c22" text-anchor="middle">Eggs ✓</text>
      <rect x="98" y="270" width="75" height="24" rx="12" fill="#10b981"/>
      <text x="135" y="286" font-family="sans-serif" font-weight="700" font-size="11" fill="#022c22" text-anchor="middle">Cheese ✓</text>
      <rect x="180" y="270" width="80" height="24" rx="12" fill="#10b981"/>
      <text x="220" y="286" font-family="sans-serif" font-weight="700" font-size="11" fill="#022c22" text-anchor="middle">Spinach ✓</text>
      
      <!-- CTA Button -->
      <rect x="20" y="310" width="240" height="42" rx="14" fill="url(#gold)"/>
      <text x="140" y="337" font-family="sans-serif" font-weight="800" font-size="14" fill="#0f172a" text-anchor="middle">Generate Gourmet Recipe</text>
    </g>
  </svg>
  `
}

async function run() {
  console.log('Generating PWA icons and Google Play Store assets...')

  // 1. icon-192.png
  const svg192 = Buffer.from(createIconSvg(192))
  await sharp(svg192).png().toFile(path.join(iconsDir, 'icon-192.png'))
  console.log('Created icon-192.png')

  // 2. icon-512.png
  const svg512 = Buffer.from(createIconSvg(512))
  await sharp(svg512).png().toFile(path.join(iconsDir, 'icon-512.png'))
  console.log('Created icon-512.png')

  // 3. icon-maskable-512.png
  const svgMaskable = Buffer.from(createIconSvg(512, true))
  await sharp(svgMaskable).png().toFile(path.join(iconsDir, 'icon-maskable-512.png'))
  console.log('Created icon-maskable-512.png')

  // 4. apple-touch-icon.png (180x180)
  const svgApple = Buffer.from(createIconSvg(180))
  await sharp(svgApple).png().toFile(path.join(publicDir, 'apple-touch-icon.png'))
  console.log('Created apple-touch-icon.png')

  // 5. favicon.ico / favicon.png (32x32)
  const svgFavicon = Buffer.from(createIconSvg(64))
  await sharp(svgFavicon).png().toFile(path.join(publicDir, 'favicon.ico'))
  console.log('Created favicon.ico')

  // 6. Google Play 512x512 App Icon
  await sharp(svg512).png().toFile(path.join(publicDir, 'play-icon-512.png'))
  console.log('Created play-icon-512.png')

  // 7. Google Play 1024x500 Feature Graphic
  const svgFeature = Buffer.from(createFeatureGraphicSvg())
  await sharp(svgFeature).png().toFile(path.join(publicDir, 'play-feature-1024x500.png'))
  console.log('Created play-feature-1024x500.png')

  console.log('All graphic assets generated successfully!')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

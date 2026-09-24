import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SnapChef AI — Smart Fridge Scanner & Leftover Chef',
    short_name: 'SnapChef AI',
    description:
      'Snap your fridge, detect fresh ingredients with AI camera vision, and cook 15-minute gourmet meals with 110+ easy recipes.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    lang: 'en',
    dir: 'ltr',
    categories: ['food', 'lifestyle', 'utilities'],
    background_color: '#052e16',
    theme_color: '#10b981',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}

import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { SwRegister } from '@/components/sw-register'
import './globals.css'

export const metadata: Metadata = {
  title: 'SnapChef AI — Snap Your Fridge. Cook in 15 Mins.',
  description:
    'Turn whatever you have in your fridge into 15-minute gourmet meals. AI camera fridge scanner, 110+ easy recipes, and custom leftover chef.',
  keywords: ['cooking', 'recipes', 'fridge scanner', 'AI chef', 'leftover recipes', '15 min meals'],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SnapChef AI',
  },
}

export const viewport: Viewport = {
  themeColor: '#052e16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans select-none">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-center" richColors closeButton />
          <SwRegister />
        </ThemeProvider>
      </body>
    </html>
  )
}

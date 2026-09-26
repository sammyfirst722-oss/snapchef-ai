import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Camera, HardDrive, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | SnapChef AI',
  description: 'How SnapChef AI collects, uses, and protects your information and camera access.',
}

const UPDATED = 'September 24, 2026'
const CONTACT = 'sammyfirst722@gmail.com'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-emerald-950/20 text-foreground py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-card border-2 border-border rounded-2xl p-6 sm:p-10 shadow-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to SnapChef AI
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {UPDATED}</p>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Overview</h2>
            <p>
              SnapChef AI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This
              policy explains how our web application and Android app handle information when you scan
              your fridge, browse recipes, and generate personalized meal plans.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-500" /> 2. Camera &amp; Image Data
            </h2>
            <p className="mb-2">
              <strong>Camera Permission:</strong> When you tap &quot;Snap Your Fridge&quot;, SnapChef AI requests
              camera permission solely to allow you to take a photo of your refrigerator or pantry.
            </p>
            <p className="mb-2">
              <strong>Processing:</strong> Captured photos are sent securely via HTTPS directly to our
              vision analysis endpoint powered by OpenRouter AI. The image is parsed in real time
              strictly to detect food and ingredient names (e.g., milk, eggs, bell peppers).
            </p>
            <p>
              <strong>No Facial Recognition or Permanent Storage:</strong> We do NOT analyze faces,
              biometric data, or personal surroundings. Images are not retained or saved on our servers
              after the ingredient recognition completes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-500" /> 3. Local Storage &amp; Preferences
            </h2>
            <p>
              Your saved favorite recipes, detected fridge inventory, dietary preferences (e.g. Keto,
              High-Protein, 15-Minute), and scan quotas are stored locally on your device via browser
              localStorage. You can clear this data at any time through your device or browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Third-Party Services</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>OpenRouter AI:</strong> Used for secure visual ingredient identification and
                recipe synthesis.
              </li>
              <li>
                <strong>Stripe:</strong> If you upgrade to SnapChef Pro, payments are processed directly by
                Stripe. We do not store or process your credit card numbers.
              </li>
              <li>
                <strong>Hosting:</strong> Deployed on Vercel with encrypted HTTPS transmission.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500" /> 5. Contact Us
            </h2>
            <p>
              If you have any questions or data requests regarding this Privacy Policy, please email us
              directly at{' '}
              <a
                href={`mailto:${CONTACT}`}
                className="font-bold text-emerald-600 underline underline-offset-2"
              >
                {CONTACT}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | SnapChef AI',
  description: 'Terms and conditions for using SnapChef AI.',
}

export default function TermsPage() {
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
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Last updated: September 24, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using SnapChef AI, you agree to be bound by these Terms of Service. If
              you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. Culinary &amp; Dietary Disclaimer</h2>
            <p>
              SnapChef AI provides automated recipe suggestions based on artificial intelligence and
              image recognition. While our recipes are curated, users are solely responsible for
              verifying food allergies, dietary restrictions, proper food handling, cooking temperatures,
              and ingredient safety before preparing or consuming any meals.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. Subscriptions &amp; In-App Purchases</h2>
            <p>
              SnapChef Pro offers optional premium access including unlimited camera scans and priority
              AI recipe generation. Subscriptions and lifetime passes are billed via Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500" /> 4. Inquiries
            </h2>
            <p>
              For legal or support inquiries, contact us at{' '}
              <a
                href="mailto:sammyfirst722@gmail.com"
                className="font-bold text-emerald-600 underline underline-offset-2"
              >
                sammyfirst722@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

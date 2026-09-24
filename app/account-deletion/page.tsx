import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Trash2, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Delete Your Account & Data | SnapChef AI',
  description: 'How to request deletion of your SnapChef AI data and preferences.',
}

export default function AccountDeletionPage() {
  return (
    <div className="min-h-screen bg-emerald-950/20 text-foreground py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-card border-2 border-border rounded-2xl p-6 sm:p-10 shadow-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to SnapChef AI
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-500">
            <Trash2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Delete Your Data</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Last updated: September 24, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            You can request deletion of all your SnapChef AI preferences, saved recipes, and local data
            at any time.
          </p>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Local Device Data</h2>
            <p>
              SnapChef AI stores your favorite recipes and active fridge inventory on your device using
              localStorage. You can delete all this data instantly by clearing your browser cache/cookies
              or selecting &quot;Clear App Data&quot; in Android Application Settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. Pro Subscriptions &amp; Billing Data</h2>
            <p>
              If you have an active SnapChef Pro subscription through Stripe, you can cancel or request
              billing data removal by emailing us with your purchase email.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500" /> 3. Request Assistance
            </h2>
            <p>
              To request full data purge assistance, contact our support team at:{' '}
              <a
                href="mailto:sammyfirst722@gmail.com?subject=SnapChef%20Data%20Deletion%20Request"
                className="font-bold text-emerald-600 underline underline-offset-2"
              >
                sammyfirst722@gmail.com
              </a>
              . We will process your request within 7 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

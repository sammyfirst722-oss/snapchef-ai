import Link from 'next/link'

export function EcosystemFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20 py-8 px-4 text-center text-xs text-muted-foreground pb-24 md:pb-8 mt-auto">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <a
            href="https://lowkeyaitech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-foreground hover:text-emerald-500 transition-colors inline-flex items-center gap-1.5"
          >
            <span>A Lowkey AI Tech Product</span>
          </a>
          <span className="text-border">•</span>
          <span>&copy; {new Date().getFullYear()} Sammy First LLC</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
          <Link href="/privacy" className="hover:text-emerald-500 hover:underline transition-colors">
            Privacy Policy
          </Link>
          <span className="text-border">•</span>
          <Link href="/terms" className="hover:text-emerald-500 hover:underline transition-colors">
            Terms of Service
          </Link>
          <span className="text-border">•</span>
          <Link href="/account-deletion" className="hover:text-emerald-500 hover:underline transition-colors">
            Delete Account &amp; Data
          </Link>
          <span className="text-border">•</span>
          <a
            href="https://lowkeyaitech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-500 hover:underline transition-colors"
          >
            All Products
          </a>
        </div>
      </div>
    </footer>
  )
}

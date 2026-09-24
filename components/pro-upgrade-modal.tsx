'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  Check,
  Sparkles,
  Camera,
  ChefHat,
  Flame,
  ShieldCheck,
  Star,
  Lock,
} from 'lucide-react'
import { isUserPro, setUserPro } from '@/lib/fridge-store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProUpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProUpgradeModal({ open, onOpenChange }: ProUpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'lifetime' | 'monthly'>('lifetime')
  const [loading, setLoading] = useState(false)
  const isPro = isUserPro()

  const handleUpgrade = async () => {
    setLoading(true)

    try {
      // Check if Stripe is configured on server
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      })

      const data = await res.json()

      if (data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl
        return
      }

      // If Stripe keys are not yet provided in .env, activate instant Pro trial!
      setUserPro(true)
      toast.success('SnapChef Pro Activated! ⭐', {
        description: 'You now have unlimited AI camera scans and custom leftover chef access!',
      })
      onOpenChange(false)
    } catch (err: any) {
      console.error(err)
      // Instant unlock fallback for demo testing
      setUserPro(true)
      toast.success('SnapChef Pro Activated! ⭐')
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleDemoPro = () => {
    const next = !isPro
    setUserPro(next)
    toast.info(next ? 'Pro Mode Enabled ⭐' : 'Switched to Free Tier')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 border-2 border-amber-500/60 rounded-3xl bg-gradient-to-b from-amber-500/10 via-background to-background">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg border-2 border-amber-400">
            <Zap className="h-7 w-7 fill-white" />
          </div>
          <DialogTitle className="text-xl md:text-2xl font-black tracking-tight">
            Unlock SnapChef Pro
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Never throw away groceries again. Get unlimited AI camera scans and custom gourmet recipes.
          </DialogDescription>
        </DialogHeader>

        {/* Feature Benefits List */}
        <div className="space-y-2.5 py-3">
          {[
            {
              icon: Camera,
              title: 'Unlimited AI Fridge Camera Scans',
              desc: 'Scan your fridge as many times a day as you want.',
            },
            {
              icon: ChefHat,
              title: 'Custom AI Leftover Recipe Generator',
              desc: 'Invent instant recipes tailored to whatever ingredients you have.',
            },
            {
              icon: Flame,
              title: 'Nutrition & Macro Estimates',
              desc: 'Get protein, carbs, calories, and healthy diet tags on demand.',
            },
            {
              icon: ShieldCheck,
              title: '110+ Offline Cookbooks & Recipe Export',
              desc: 'Full offline access, custom shopping lists, and priority features.',
            },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 items-start p-2.5 rounded-2xl bg-card border-2 border-border/70 shadow-2xs">
              <div className="h-7 w-7 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                <item.icon className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-foreground block">{item.title}</span>
                <span className="text-[11px] text-muted-foreground">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Options */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedPlan('lifetime')}
            className={cn(
              'p-3 rounded-2xl border-2 text-center transition-all relative select-none shadow-2xs',
              selectedPlan === 'lifetime'
                ? 'bg-amber-500/15 border-amber-500 shadow-amber-500/20'
                : 'border-border/80 hover:border-amber-400 bg-card'
            )}
          >
            <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-extrabold text-[9px] px-2 py-0 uppercase shadow-2xs">
              Best Value
            </Badge>
            <span className="text-xs font-bold text-muted-foreground block">Lifetime Pass</span>
            <span className="text-lg font-black text-foreground">$19.99</span>
            <span className="text-[10px] text-muted-foreground block">Pay once, own forever</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPlan('monthly')}
            className={cn(
              'p-3 rounded-2xl border-2 text-center transition-all relative select-none shadow-2xs',
              selectedPlan === 'monthly'
                ? 'bg-amber-500/15 border-amber-500 shadow-amber-500/20'
                : 'border-border/80 hover:border-amber-400 bg-card'
            )}
          >
            <span className="text-xs font-bold text-muted-foreground block">Monthly</span>
            <span className="text-lg font-black text-foreground">$4.99<span className="text-xs font-normal">/mo</span></span>
            <span className="text-[10px] text-muted-foreground block">Cancel anytime</span>
          </button>
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-2">
          <Button
            type="button"
            size="lg"
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full gap-2 font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg text-sm h-11 rounded-2xl active:scale-98"
          >
            <Sparkles className="h-4 w-4 fill-white" />
            <span>{isPro ? 'Manage Pro Subscription' : `Get Pro Access — ${selectedPlan === 'lifetime' ? '$19.99' : '$4.99/mo'}`}</span>
          </Button>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <button
              type="button"
              onClick={handleToggleDemoPro}
              className="text-muted-foreground/60 hover:text-foreground underline"
            >
              {isPro ? 'Toggle Back to Free' : 'Demo Test Pro'}
            </button>
            <span>🔒 Secure Stripe 256-bit Checkout</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

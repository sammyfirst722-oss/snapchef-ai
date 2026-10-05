'use client'

import React, { useState } from 'react'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      
      if (res.ok && data.success) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Network error. Please try again later.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center max-w-md mx-auto">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h4 className="text-emerald-700 dark:text-emerald-400 font-bold mb-2">Welcome to the club!</h4>
        <p className="text-emerald-600 dark:text-emerald-500 text-sm">{message}</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-2xl">
      <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Mail className="w-6 h-6 text-rose-500" />
      </div>
      <h3 className="text-2xl font-black text-white mb-2">Get a Free Weekly Meal Plan</h3>
      <p className="text-slate-400 text-sm mb-6">
        Join 10,000+ others getting high-protein, budget-friendly meal prep plans delivered every Sunday morning.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Joining...' : 'Join Free'}
          {!status && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-rose-400 text-xs text-left mt-3">{message}</p>
      )}
    </div>
  )
}

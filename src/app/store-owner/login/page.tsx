'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function OwnerLogin() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async () => {
    setLoading(true)
    await supabase.auth.signInWithOtp({
  email,
  options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/store-owner/dashboard` },
})
    setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
        <p className="text-gray-600">We sent a login link to <strong>{email}</strong>. Click it to access your store dashboard.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <span className="text-4xl">🐟</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Store Owner Login</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your email to get a login link</p>
        </div>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button
            onClick={handleLogin}
            disabled={loading || !email}
            className="w-full bg-[#4A90D9] hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send Login Link'}
          </button>
        </div>
      </div>
    </div>
  )
}
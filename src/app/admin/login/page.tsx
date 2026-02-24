'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const ALLOWED_EMAIL = 'killerpings@gmail.com'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email.toLowerCase() !== ALLOWED_EMAIL) {
      alert('Access denied. This admin area is private.')
      return
    }
    setLoading(true)
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'https://lfsdirectory.com/auth/callback' }
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🐠</span>
          <h1 className="text-2xl font-bold text-gray-800">LFSDirectory Admin</h1>
        </div>
        <p className="text-gray-500 mb-6">Sign in to manage your directory</p>

        {sent ? (
          <div className="bg-blue-50 border border-blue-200 rounded p-4 text-blue-800">
            ✅ Check your email for a magic link to sign in.
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

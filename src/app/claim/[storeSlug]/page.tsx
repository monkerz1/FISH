'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function ClaimListingPage() {
  const params = useParams()
  const storeSlug = params.storeSlug as string
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'owner',
    phone: '',
    tenure: '1-3',
    notes: '',
  })

  const storeName = storeSlug
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/claims/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, storeSlug }),
      })
      if (res.ok) setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Claim Request Submitted!</h1>
          <p className="text-gray-600">Check your email for a verification link. We'll review your claim within 48 hours.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/" className="hover:underline">Home</a> &rsaquo; <a href="/claim" className="hover:underline">Claim</a> &rsaquo; {storeName}
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Claim {storeName}</h1>
        </div>

        {/* Benefits box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium mb-1">Claiming is free.</p>
          <p className="text-blue-700 text-sm">Once verified, you can update your hours, add photos, respond to reviews, and post new arrivals.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow p-6 space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Email <span className="text-red-500">*</span></label>
            <p className="text-xs text-gray-500 mb-1">We'll send a verification link here</p>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Role <span className="text-red-500">*</span></label>
            <div className="flex gap-4">
              {['owner', 'manager', 'employee'].map(role => (
                <label key={role} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="accent-blue-600"
                  />
                  <span className="text-sm capitalize">{role}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Phone Number <span className="text-red-500">*</span></label>
            <p className="text-xs text-gray-500 mb-1">Must match the public phone number so we can verify</p>
            <input
              type="tel"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">How long have you worked here?</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.tenure}
              onChange={e => setFormData({...formData, tenure: e.target.value})}
            >
              <option value="less-than-1">Less than 1 year</option>
              <option value="1-3">1–3 years</option>
              <option value="3+">3+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Info (optional)</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          {/* What happens next */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">What happens next:</p>
            <ol className="space-y-1 text-sm text-gray-600 list-none">
              <li>1. We email you a verification link</li>
              <li>2. You click the link to confirm your email</li>
              <li>3. We verify your ownership within 48 hours and notify you</li>
            </ol>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !formData.name || !formData.email || !formData.phone}
            className="w-full bg-[#4A90D9] hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Claim Request'}
          </button>
        </div>
      </div>
    </div>
  )
}

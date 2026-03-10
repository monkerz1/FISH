'use client'

import { useState } from 'react'
import { Footer } from '@/components/footer'
import Link from 'next/link'

const STATE_OPTIONS = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY'
]

const FOCUS_OPTIONS = [
  'reef', 'saltwater', 'freshwater', 'planted', 'general', 'pond', 'cichlid', 'discus'
]

export default function AddClubPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', city: '', state: 'AL', website: '', facebook_url: '',
    email: '', focus: [] as string[], meeting_frequency: '',
    description: '', submitter_name: '', submitter_email: '', is_owner: '',
  })

  const toggleFocus = (f: string) => {
    setForm(prev => ({
      ...prev,
      focus: prev.focus.includes(f) ? prev.focus.filter(x => x !== f) : [...prev.focus, f]
    }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.city.trim() || !form.state) {
      setError('Club name, city, and state are required.'); return
    }
    if (!form.submitter_name.trim() || !form.submitter_email.trim()) {
      setError('Your name and email are required.'); return
    }
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/clubs/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      setSubmitted(true)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setSubmitting(false) }
  }

  if (submitted) {
    return (
      <main className="w-full">
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-6">🐠</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Thanks for your submission!</h1>
          <p className="text-gray-600 mb-8">We will review your club and get it listed within 48 hours.</p>
          <Link href="/clubs" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
            Browse Clubs
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="w-full">
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <nav className="text-sm text-blue-200 mb-4 flex gap-2 items-center">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/clubs" className="hover:text-white">Clubs</Link>
            <span>/</span>
            <span className="text-white">Submit a Club</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Submit an Aquarium Club</h1>
          <p className="text-blue-100">Help the community find local clubs and reef societies. Listing is free.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

          <h2 className="text-lg font-bold text-gray-800 mb-5">Club Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Club Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Southern California Reefers" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input type="text" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Los Angeles" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {STATE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="url" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input type="url" value={form.facebook_url} onChange={e => setForm(p => ({ ...p, facebook_url: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/..." />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Club Contact Email</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="club@example.com" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Focus / Specialty</label>
            <div className="flex flex-wrap gap-2">
              {FOCUS_OPTIONS.map(f => (
                <button key={f} type="button" onClick={() => toggleFocus(f)}
                  className={`text-sm px-3 py-1 rounded-full capitalize border transition-colors ${
                    form.focus.includes(f) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Frequency</label>
            <input type="text" value={form.meeting_frequency} onChange={e => setForm(p => ({ ...p, meeting_frequency: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Monthly, Bi-monthly" />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the club..." />
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-5 pt-4 border-t border-gray-200">Your Information</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
              <input type="text" value={form.submitter_name} onChange={e => setForm(p => ({ ...p, submitter_name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jane Smith" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
              <input type="email" value={form.submitter_email} onChange={e => setForm(p => ({ ...p, submitter_email: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com" />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Are you a club member or officer?</label>
            <div className="flex gap-4">
              {['Yes', 'No'].map(v => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="is_owner" value={v} checked={form.is_owner === v}
                    onChange={e => setForm(p => ({ ...p, is_owner: e.target.value }))} className="accent-blue-600" />
                  <span className="text-sm text-gray-700">{v}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 transition-colors">
            {submitting ? 'Submitting...' : 'Submit Club'}
          </button>
          <p className="text-xs text-gray-400 text-center mt-4">We review all submissions before listing. Usually within 48 hours.</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}

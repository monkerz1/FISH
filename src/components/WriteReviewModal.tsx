'use client'

import { useState } from 'react'

interface Props {
  storeId: string
  storeName: string
  onClose: () => void
}

function StarPicker({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="text-2xl leading-none transition-transform hover:scale-110"
          >
            <span className={(hovered || value) >= s ? 'text-amber-400' : 'text-slate-200'}>★</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function WriteReviewModal({ storeId, storeName, onClose }: Props) {
  const [form, setForm] = useState({
    display_name: '',
    overall_rating: 0,
    livestock_health: 0,
    staff_knowledge: 0,
    quarantine_practices: 0,
    price_fairness: 0,
    review_text: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.display_name.trim()) return setError('Please enter your name.')
    if (form.overall_rating === 0) return setError('Please select an overall rating.')

    setSubmitting(true)
    setError('')

    const res = await fetch('/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ store_id: storeId, ...form }),
    })

    const data = await res.json()
    setSubmitting(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Write a Review</h2>
            <p className="text-xs text-slate-500 mt-0.5">{storeName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">✕</button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Thanks for your review!</h3>
            <p className="text-sm text-slate-500">Your review has been submitted and will appear after a quick moderation check.</p>
            <button onClick={onClose} className="mt-5 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">Done</button>
          </div>
        ) : (
          <div className="p-5 space-y-5">

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="First name or nickname"
                  value={form.display_name}
                  onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Overall Rating *</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, overall_rating: s }))}
                    className="text-4xl leading-none transition-transform hover:scale-110"
                  >
                    <span className={form.overall_rating >= s ? 'text-amber-400' : 'text-slate-200'}>★</span>
                  </button>
                ))}
              </div>
              {form.overall_rating > 0 && (
                <p className="text-center text-xs text-slate-500 mt-2">
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][form.overall_rating]}
                </p>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Rate the Details (optional)</p>
              <StarPicker label="🐟 Livestock Health" value={form.livestock_health} onChange={v => setForm(f => ({ ...f, livestock_health: v }))} />
              <StarPicker label="🧑‍🔬 Staff Knowledge" value={form.staff_knowledge} onChange={v => setForm(f => ({ ...f, staff_knowledge: v }))} />
              <StarPicker label="🔬 Quarantine Practices" value={form.quarantine_practices} onChange={v => setForm(f => ({ ...f, quarantine_practices: v }))} />
              <StarPicker label="💰 Pricing Fairness" value={form.price_fairness} onChange={v => setForm(f => ({ ...f, price_fairness: v }))} />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Your Review</label>
              <textarea
                rows={4}
                placeholder="Share your experience — livestock quality, staff knowledge, what they carry..."
                value={form.review_text}
                onChange={e => setForm(f => ({ ...f, review_text: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <p className="text-xs text-slate-400 text-center">Reviews are moderated before appearing publicly.</p>
          </div>
        )}
      </div>
    </div>
  )
}
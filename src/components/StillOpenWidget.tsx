'use client'

import { useState, useEffect } from 'react'

interface StillOpenWidgetProps {
  storeId: string
  lastVerified?: string | null
}

export default function StillOpenWidget({ storeId, lastVerified }: StillOpenWidgetProps) {
  const [confirmations, setConfirmations] = useState<number>(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [action, setAction] = useState<'still_open' | 'report_closed' | null>(null)

  useEffect(() => {
    fetch(`/api/verifications?store_id=${storeId}`)
      .then(r => r.json())
      .then(data => setConfirmations(data.confirmations || 0))
      .catch(() => {})
  }, [storeId])

  const getFreshnessColor = () => {
    if (!lastVerified) return 'bg-gray-100 border-gray-200 text-gray-600'
    const days = Math.floor((Date.now() - new Date(lastVerified).getTime()) / (1000 * 60 * 60 * 24))
    if (days <= 30) return 'bg-green-50 border-green-200 text-green-700'
    if (days <= 90) return 'bg-yellow-50 border-yellow-200 text-yellow-700'
    return 'bg-red-50 border-red-200 text-red-700'
  }

  const getFreshnessLabel = () => {
    if (!lastVerified) return 'Never verified'
    const days = Math.floor((Date.now() - new Date(lastVerified).getTime()) / (1000 * 60 * 60 * 24))
    if (days <= 30) return `Verified ${days} day${days === 1 ? '' : 's'} ago`
    if (days <= 90) return `Verified ${days} days ago`
    return `Last verified ${days} days ago — needs update`
  }

  const handleVerification = async (type: 'still_open' | 'report_closed') => {
    setLoading(true)
    setError('')
    setAction(type)

    try {
      const res = await fetch('/api/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: storeId, verification_type: type })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        setAction(null)
      } else {
        setSubmitted(true)
        if (type === 'still_open') {
          setConfirmations(data.confirmations)
        }
      }
    } catch {
      setError('Network error. Please try again.')
      setAction(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`rounded-lg border p-4 ${getFreshnessColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm uppercase tracking-wide">
          Is This Store Still Open?
        </h3>
        <span className="text-xs font-medium">{getFreshnessLabel()}</span>
      </div>

      {!submitted ? (
        <>
          <p className="text-sm mb-3 opacity-80">
            Help the community — confirm this store is still open or report if it has closed.
          </p>
          {confirmations > 0 && (
            <p className="text-sm font-medium mb-3">
              ✓ {confirmations} {confirmations === 1 ? 'person has' : 'people have'} confirmed open in the last 90 days
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => handleVerification('still_open')}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors disabled:opacity-50"
            >
              {loading && action === 'still_open' ? '...' : '✓ Yes, Still Open!'}
            </button>
            <button
              onClick={() => handleVerification('report_closed')}
              disabled={loading}
              className="flex-1 bg-white hover:bg-gray-50 text-red-600 border border-red-300 text-sm font-medium py-2 px-3 rounded-md transition-colors disabled:opacity-50"
            >
              {loading && action === 'report_closed' ? '...' : '✗ Report Closed'}
            </button>
          </div>
          {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
        </>
      ) : (
        <div className="text-center py-2">
          {action === 'still_open' ? (
            <p className="text-green-700 font-medium">
              ✓ Thanks for confirming! {confirmations > 0 && `(${confirmations} total confirmations)`}
            </p>
          ) : (
            <p className="text-orange-700 font-medium">
              Thanks for the report. We'll review this store soon.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
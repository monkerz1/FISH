import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function ClaimIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-5xl mb-4">🐠</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Claim Your Store Listing</h1>
        <p className="text-gray-600 mb-8">
          Find your store in our directory and click <strong>"Claim This Listing"</strong> on your store's page to get started.
        </p>
        <div className="bg-white rounded-xl shadow p-6 text-left mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">How it works:</p>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>1. Search for your store using the button below</li>
            <li>2. Open your store's listing page</li>
            <li>3. Click <strong>"Claim This Listing"</strong> at the bottom</li>
            <li>4. Fill out the short form — it takes 2 minutes</li>
            <li>5. We verify and activate your listing within 48 hours</li>
          </ol>
        </div>
        <Link
          href="/find-a-store"
          className="inline-block bg-[#4A90D9] hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Find My Store
        </Link>
      </div>
    </div>
  )
}

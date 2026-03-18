'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function OwnerDashboard() {
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const init = async () => {
      // Wait for session to hydrate from the magic link
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  // Retry up to 3 times with increasing delays for magic link session hydration
  let retrySession = null
  for (let i = 0; i < 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000 + i * 1000))
    const { data: { session: s } } = await supabase.auth.getSession()
    if (s) { retrySession = s; break }
  }
  if (!retrySession) {
    router.push('/store-owner/login')
    return
  }
}

const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  router.push('/store-owner/login')
  return
}

const { data: storeData } = await supabase
  .from('stores')
  .select('id, name, city, state, description, specialty_tags, is_claimed, verification_status')
  .eq('owner_user_id', user.id)
  .single()

if (!storeData) {
  router.push('/store-owner/no-store')
  return
}

setStore(storeData)
setLoading(false)
    }
    init()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading your dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐟</span>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{store.name}</h1>
            <p className="text-sm text-gray-500">{store.city}, {store.state}</p>
          </div>
        </div>
        <button
          onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Verified badge */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <span className="text-green-600 text-xl">✓</span>
          <div>
            <p className="font-semibold text-green-800">Your listing is claimed and verified</p>
            <p className="text-sm text-green-700">You can update your description, specialty tags, and hours below.</p>
          </div>
        </div>

        {/* Edit sections */}
        <div className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Manage Your Listing</h2>
          <p className="text-sm text-gray-500">Click Edit to update each section. Changes go live immediately.</p>

          <div className="divide-y divide-gray-100">
            {/* Description */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Store Description</p>
                <p className="text-sm text-gray-500 mt-0.5 max-w-md truncate">
                  {store.description || 'No description yet — add one to help customers find you.'}
                </p>
              </div>
              <button
                onClick={() => router.push(`/store-owner/edit/${store.id}?section=description`)}
                className="ml-4 px-4 py-2 bg-[#4A90D9] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            </div>

            {/* Tags */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Specialty Tags</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {store.specialty_tags?.length
                    ? store.specialty_tags.join(', ')
                    : 'No tags set — add your specialties.'}
                </p>
              </div>
              <button
                onClick={() => router.push(`/store-owner/edit/${store.id}?section=tags`)}
                className="ml-4 px-4 py-2 bg-[#4A90D9] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            </div>
            {/* Services & Supplies */}
<div className="py-4 flex items-center justify-between">
  <div>
    <p className="font-medium text-gray-800">Services & Supplies</p>
    <p className="text-sm text-gray-500 mt-0.5">What services and products does your store offer?</p>
  </div>
  <button
    onClick={() => router.push(`/store-owner/edit/${store.id}?section=services`)}
    className="ml-4 px-4 py-2 bg-[#4A90D9] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
  >
    Edit
  </button>
</div>
            {/* Hours */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Store Hours</p>
                <p className="text-sm text-gray-500 mt-0.5">Update your weekly opening hours.</p>
              </div>
              <button
                onClick={() => router.push(`/store-owner/edit/${store.id}?section=hours`)}
                className="ml-4 px-4 py-2 bg-[#4A90D9] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            </div>

            {/* Social Media */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Social Media</p>
                <p className="text-sm text-gray-500 mt-0.5">Add your Facebook, Instagram, YouTube, or TikTok links.</p>
              </div>
              <button
                onClick={() => router.push(`/store-owner/edit/${store.id}?section=socials`)}
                className="ml-4 px-4 py-2 bg-[#4A90D9] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            </div>
            <div className="border-t border-gray-100" />
            {/* Photos */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Photos</p>
                <p className="text-sm text-gray-500 mt-0.5">Upload your own photos, hide Google photos, and set display order.</p>
              </div>
              <button
                onClick={() => router.push(`/store-owner/edit/${store.id}?section=photos`)}
                className="ml-4 px-4 py-2 bg-[#4A90D9] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Info-only box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-800 mb-1">Need to update your phone, address, or website?</p>
          <p className="text-sm text-blue-700">Those changes are reviewed by our team. <a href="/contact" className="underline">Contact us</a> with your request.</p>
        </div>

      </div>
    </div>
  )
}
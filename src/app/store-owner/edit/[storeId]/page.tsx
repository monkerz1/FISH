'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, useParams, useSearchParams } from 'next/navigation'

const SPECIALTY_OPTIONS = [
  'Saltwater & Reef',
  'Freshwater',
  'Corals',
  'Live Plants',
  'Koi & Pond',
  'Rare Species',
  'Invertebrates',
  'Cichlids',
  'Bettas',
  'Discus',
]

const SERVICES_OPTIONS = [
  'Water Testing',
  'Custom Tanks',
  'Delivery',
  'Aquarium Maintenance',
  'Installation',
  'Aquarium Design',
  'Coral Fragging',
  'Fish Boarding',
]

const SUPPLIES_OPTIONS = [
  'Live Rock',
  'Live Sand',
  'Frozen Food',
  'Live Food',
  'Dry Food',
  'RO Water',
  'Salt Mix',
  'Reef Supplements',
  'Lighting',
  'Filtration',
  'RO Unit',
  'Driftwood',
  'Medications',
  'CO2 Systems',
]

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const DEFAULT_HOURS = DAYS.map((_, i) => ({
  day_of_week: i,
  open_time: '10:00',
  close_time: '18:00',
  is_closed: false,
}))

export default function EditStorePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const section = searchParams.get('section') || 'description'
  const storeId = params.storeId as string
  const router = useRouter()

  const [store, setStore] = useState<any>(null)
  const [hours, setHours] = useState(DEFAULT_HOURS)
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedSupplies, setSelectedSupplies] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/store-owner/login'); return }

      const { data: storeData } = await supabase
        .from('stores')
        .select('id, name, city, state, description, specialty_tags, services')
        .eq('id', storeId)
        .eq('owner_user_id', user.id)
        .single()

      if (!storeData) { router.push('/store-owner/dashboard'); return }

      setStore(storeData)
      setDescription(storeData.description || '')
      setSelectedTags(storeData.specialty_tags || [])

      // Split services array into services and supplies buckets
      const allServices = storeData.services || []
      setSelectedServices(allServices.filter((s: string) => SERVICES_OPTIONS.includes(s)))
      setSelectedSupplies(allServices.filter((s: string) => SUPPLIES_OPTIONS.includes(s)))

      // Load hours
      const { data: hoursData } = await supabase
        .from('store_hours')
        .select('*')
        .eq('store_id', storeId)
        .order('day_of_week')

      if (hoursData && hoursData.length > 0) {
        const merged = DEFAULT_HOURS.map(def => {
          const found = hoursData.find((h: any) => h.day_of_week === def.day_of_week)
          if (found) {
            return {
              day_of_week: found.day_of_week,
              open_time: found.open_time?.slice(0, 5) || '10:00',
              close_time: found.close_time?.slice(0, 5) || '18:00',
              is_closed: found.is_closed || false,
            }
          }
          return def
        })
        setHours(merged)
      }

      setLoading(false)
    }
    init()
  }, [storeId])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const toggleService = (item: string) => {
    setSelectedServices(prev =>
      prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item]
    )
  }

  const toggleSupply = (item: string) => {
    setSelectedSupplies(prev =>
      prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item]
    )
  }

  const updateHour = (dayIndex: number, field: string, value: string | boolean) => {
    setHours(prev => prev.map(h =>
      h.day_of_week === dayIndex ? { ...h, [field]: value } : h
    ))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)

    try {
      if (section === 'description') {
        await supabase
          .from('stores')
          .update({ description })
          .eq('id', storeId)
      }

      if (section === 'tags') {
        await supabase
          .from('stores')
          .update({ specialty_tags: selectedTags })
          .eq('id', storeId)

        await supabase
          .from('store_tags')
          .delete()
          .eq('store_id', storeId)

        if (selectedTags.length > 0) {
          await supabase
            .from('store_tags')
            .insert(selectedTags.map(tag => ({ store_id: storeId, tag })))
        }
      }

      if (section === 'services') {
        // Combine both arrays back into one services column
        const combined = [...selectedServices, ...selectedSupplies]
        await supabase
          .from('stores')
          .update({ services: combined })
          .eq('id', storeId)
      }

      if (section === 'hours') {
        await supabase
          .from('store_hours')
          .delete()
          .eq('store_id', storeId)

        await supabase
          .from('store_hours')
          .insert(hours.map(h => ({
            store_id: storeId,
            day_of_week: h.day_of_week,
            open_time: h.is_closed ? null : `${h.open_time}:00`,
            close_time: h.is_closed ? null : `${h.close_time}:00`,
            is_closed: h.is_closed,
          })))
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push('/store-owner/dashboard')}
          className="text-sm text-[#4A90D9] hover:underline"
        >
          ← Back to Dashboard
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{store?.name}</h1>
          <p className="text-sm text-gray-500 capitalize">Editing: {section}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow p-6 space-y-6">

          {/* DESCRIPTION */}
          {section === 'description' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Store Description</h2>
              <p className="text-sm text-gray-500 mb-4">
                Describe your store in a few sentences. What makes you unique? What do you specialize in? (Max 500 characters)
              </p>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={6}
                maxLength={500}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. We're a family-owned aquarium shop specializing in rare reef fish, SPS corals, and high-end aquarium equipment."
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/500</p>
            </div>
          )}

          {/* SPECIALTY TAGS */}
          {section === 'tags' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Specialty Tags</h2>
              <p className="text-sm text-gray-500 mb-4">
                Select all that apply. These help hobbyists find your store when filtering by specialty.
              </p>
              <div className="flex flex-wrap gap-2">
                {SPECIALTY_OPTIONS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-[#4A90D9] text-white border-[#4A90D9]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <p className="text-xs text-gray-500 mt-3">Selected: {selectedTags.join(', ')}</p>
              )}
            </div>
          )}

          {/* SERVICES & SUPPLIES */}
          {section === 'services' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Services & Supplies</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Select everything your store offers. This helps customers find you for specific needs.
                </p>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {SERVICES_OPTIONS.map(item => (
                    <button
                      key={item}
                      onClick={() => toggleService(item)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        selectedServices.includes(item)
                          ? 'bg-[#4A90D9] text-white border-[#4A90D9]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Supplies */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Supplies</h3>
                <div className="flex flex-wrap gap-2">
                  {SUPPLIES_OPTIONS.map(item => (
                    <button
                      key={item}
                      onClick={() => toggleSupply(item)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        selectedSupplies.includes(item)
                          ? 'bg-[#4A90D9] text-white border-[#4A90D9]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HOURS */}
          {section === 'hours' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Store Hours</h2>
              <p className="text-sm text-gray-500 mb-4">
                Set your weekly hours. Check "Closed" for days you're not open.
              </p>
              <div className="space-y-3">
                {hours.map((h) => (
                  <div key={h.day_of_week} className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium text-gray-700">{DAYS[h.day_of_week]}</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={h.is_closed}
                        onChange={e => updateHour(h.day_of_week, 'is_closed', e.target.checked)}
                        className="accent-red-500"
                      />
                      <span className="text-xs text-gray-500">Closed</span>
                    </label>
                    {!h.is_closed && (
                      <>
                        <input
                          type="time"
                          value={h.open_time}
                          onChange={e => updateHour(h.day_of_week, 'open_time', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-400 text-sm">to</span>
                        <input
                          type="time"
                          value={h.close_time}
                          onChange={e => updateHour(h.day_of_week, 'close_time', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </>
                    )}
                    {h.is_closed && (
                      <span className="text-sm text-red-400 italic">Closed all day</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[#4A90D9] hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && (
              <span className="text-green-600 text-sm font-medium">✓ Saved successfully!</span>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
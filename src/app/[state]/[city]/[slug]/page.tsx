import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Footer } from '@/components/footer'
import StillOpenWidget from '@/components/StillOpenWidget'
import PhotoGallery from '@/components/PhotoGallery'

interface StorePageProps {
  params: Promise<{ state: string; city: string; slug: string }>
}

export async function generateMetadata({ params }: StorePageProps) {
  const { slug } = await params
  const { data: store } = await supabase
    .from('stores')
    .select('name, city, state, description')
    .eq('slug', slug)
    .single()

  if (!store) return {}

  return {
    title: `${store.name} — Fish Store in ${store.city}, ${store.state} | LFSDirectory`,
    description: store.description || `${store.name} is a local fish store in ${store.city}, ${store.state}. Find hours, directions, and reviews on LFSDirectory.`,
  }
}

const SPECIALTY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  saltwater:     { label: 'Saltwater',   color: '#0369a1', bg: '#e0f2fe', border: '#7dd3fc' },
  reef:          { label: 'Reef',        color: '#4338ca', bg: '#eef2ff', border: '#a5b4fc' },
  freshwater:    { label: 'Freshwater',  color: '#15803d', bg: '#dcfce7', border: '#86efac' },
  corals:        { label: 'Corals',      color: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
  plants:        { label: 'Live Plants', color: '#4d7c0f', bg: '#f7fee7', border: '#bef264' },
  koi:           { label: 'Koi & Pond',  color: '#0f766e', bg: '#ccfbf1', border: '#5eead4' },
  invertebrates: { label: 'Inverts',     color: '#be185d', bg: '#fce7f3', border: '#f9a8d4' },
}


function SpecialtyBadge({ tag }: { tag: string }) {
  const cfg = SPECIALTY_CONFIG[tag.toLowerCase()] || { label: tag, color: '#475569', bg: '#f1f5f9', border: '#cbd5e1' }
  return (
    <span style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize">
      {cfg.label}
    </span>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20">
          <path fill={i <= Math.floor(rating) ? '#F59E0B' : '#E2E8F0'}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  )
}


export default async function StorePage({ params }: StorePageProps) {
  const { state: stateSlug, city: citySlug, slug } = await params

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!store) notFound()

  const { data: hoursRows } = await supabase
    .from('store_hours')
    .select('*')
    .eq('store_id', store.id)
    .order('day_of_week')

  const storeHours = hoursRows || []

  const timezone = store.timezone || 'America/New_York'
  const nowInZone = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }))
  const todayDay = nowInZone.getDay()
  const nowMinutes = nowInZone.getHours() * 60 + nowInZone.getMinutes()
  const todayHours = storeHours.find((h: { day_of_week: number }) => h.day_of_week === todayDay)
  let isOpenNow = false
  if (todayHours && !todayHours.is_closed && todayHours.open_time && todayHours.close_time) {
    const [openH, openM] = todayHours.open_time.split(':').map(Number)
    const [closeH, closeM] = todayHours.close_time.split(':').map(Number)
    isOpenNow = nowMinutes >= (openH * 60 + openM) && nowMinutes < (closeH * 60 + closeM)
  }

  function formatTime(t: string) {
    const [h, m] = t.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
  }

  const cityName = citySlug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const displayAddress = `${store.address}, ${store.city}, ${store.state} ${store.zip || ""}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(displayAddress)}`
  const photos: string[] = Array.isArray(store.photos) ? store.photos : []
  const hasPhotos = photos.length > 0 && photos[0] !== '__none'

  return (
    <main className="min-h-screen bg-slate-50">

      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-3 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>›</span>
          <Link href={`/${stateSlug}`} className="hover:text-blue-600 transition-colors capitalize">{stateSlug}</Link>
          <span>›</span>
          <Link href={`/${stateSlug}/${citySlug}`} className="hover:text-blue-600 transition-colors">{cityName}</Link>
          <span>›</span>
          <span className="text-slate-800 font-medium">{store.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-5">

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              {hasPhotos && <PhotoGallery photos={photos} />}
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">{store.name}</h1>
                    <p className="text-slate-500 text-sm mt-0.5">{store.city}, {store.state}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {store.is_claimed ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        ✓ Verified Owner
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        Unclaimed
                      </span>
                    )}
                    {store.store_type === 'independent' && (
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                        🐠 Independent
                      </span>
                    )}
                  </div>
                </div>

                {store.rating > 0 && (
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-slate-900">{Number(store.rating).toFixed(1)}</span>
                    <StarRating rating={store.rating} />
                    <span className="text-slate-400 text-sm">·</span>
                    <span className="text-sm text-slate-500">{store.review_count?.toLocaleString()} Google reviews</span>
                    {storeHours.length > 0 && (
                      <>
                        <span className="text-slate-400 text-sm">·</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isOpenNow ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {isOpenNow ? '● Open Now' : '● Closed'}
                        </span>
                      </>
                    )}
                    {store.price_level && (
                      <>
                        <span className="text-slate-400 text-sm">·</span>
                        <span className="text-sm font-medium text-slate-600">{"$".repeat(store.price_level)}</span>
                      </>
                    )}
                  </div>
                )}

                {store.specialty_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {store.specialty_tags.map((tag: string) => <SpecialtyBadge key={tag} tag={tag} />)}
                  </div>
                )}

                {store.description && (
                  <p className="text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">
                    {store.description}
                  </p>
                )}
              </div>
            </div>

            {store.services?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-sm">🔧</span>
                  Services Offered
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {store.services.map((service: string) => (
                    <div key={service} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                      <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                      <span className="text-sm text-slate-700 capitalize font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {store.social_links && Object.keys(store.social_links).length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center text-sm">📱</span>
                  Find Us Online
                </h2>
                <div className="flex flex-wrap gap-3">
                  {store.social_links.instagram && (
                    <a href={store.social_links.instagram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50 transition-all text-sm font-medium text-slate-700">
                      📸 Instagram
                    </a>
                  )}
                  {store.social_links.facebook && (
                    <a href={store.social_links.facebook} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm font-medium text-slate-700">
                      👥 Facebook
                    </a>
                  )}
                  {store.social_links.twitter && (
                    <a href={store.social_links.twitter} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all text-sm font-medium text-slate-700">
                      🐦 Twitter / X
                    </a>
                  )}
                  {store.social_links.youtube && (
                    <a href={store.social_links.youtube} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-all text-sm font-medium text-slate-700">
                      ▶️ YouTube
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-yellow-100 rounded-lg flex items-center justify-center text-sm">⭐</span>
                  Community Reviews
                </h2>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all">
                  + Write a Review
                </button>
              </div>
              {store.rating > 0 && (
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-slate-900">{Number(store.rating).toFixed(1)}</div>
                    <StarRating rating={store.rating} />
                    <div className="text-xs text-slate-500 mt-1">{store.review_count?.toLocaleString()} Google reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5,4,3,2,1].map((s) => (
                      <div key={s} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500 w-3">{s}</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: s === 5 ? '65%' : s === 4 ? '20%' : s === 3 ? '8%' : s === 2 ? '4%' : '3%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-center py-6 text-slate-400">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-sm font-medium text-slate-600">No community reviews yet</p>
                <p className="text-xs mt-1">Be the first to rate this store on livestock health, staff knowledge, and more.</p>
              </div>
            </div>

          </div>

          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              {storeHours.length > 0 && (
              <div className={`rounded-2xl p-4 shadow-sm border text-center ${isOpenNow ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`text-2xl font-bold mb-0.5 ${isOpenNow ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isOpenNow ? '● Open Now' : '● Closed Now'}
                </div>
                {todayHours && !todayHours.is_closed && todayHours.open_time && todayHours.close_time && (
                  <p className={`text-xs font-medium ${isOpenNow ? 'text-emerald-600' : 'text-red-500'}`}>
                    {isOpenNow
                      ? `Closes at ${formatTime(todayHours.close_time)}`
                      : `Opens at ${formatTime(todayHours.open_time)}`}
                  </p>
                )}
              </div>
            )}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contact & Location</h3>
              {store.phone && (
                <a href={`tel:${store.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all group">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Phone</div>
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">{store.phone}</div>
                  </div>
                </a>
              )}
              {store.website && (
                <a href={store.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all group">
                  <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">Website</div>
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 truncate">{store.website.replace(/^https?:\/\//, '')}</div>
                  </div>
                </a>
              )}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Address</div>
                  <div className="text-sm font-medium text-slate-800 leading-snug">{store.address}</div>
                </div>
              </div>
              <a href={dirUrl} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl transition-all">
                🗺️ Get Directions
              </a>
            </div>

            {store.lat && store.lng && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <iframe
                  title="Store location"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${store.lng - 0.01}%2C${store.lat - 0.008}%2C${store.lng + 0.01}%2C${store.lat + 0.008}&layer=mapnik&marker=${store.lat}%2C${store.lng}`}
                />
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline font-medium">
                    View larger map →
                  </a>
                </div>
              </div>
            )}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">🕐 Hours</h3>
              {storeHours.length > 0 ? (
                <div className="space-y-0.5 text-sm">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => {
                    const h = storeHours.find((x: { day_of_week: number }) => x.day_of_week === i)
                    const isToday = todayDay === i
                    return (
                      <div key={day} className={`flex justify-between py-1.5 px-2 rounded-lg text-xs ${isToday ? 'bg-blue-50 font-semibold text-blue-800' : 'text-slate-600'}`}>
                        <span className="w-8">{day}</span>
                        <span>
                          {h && !h.is_closed && h.open_time && h.close_time
                            ? `${formatTime(h.open_time)} – ${formatTime(h.close_time)}`
                            : h?.is_closed ? 'Closed' : 'Call'}
                        </span>
                      </div>
                    )
                  })}
                  <p className="text-xs text-slate-400 pt-2 px-1">Times in {timezone.replace('_', ' ')}</p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-700 font-medium mb-1">Hours not listed</p>
                  {!store.is_claimed && (
                    <Link href={`/claim/${store.slug}`} className="text-xs font-semibold text-amber-700 hover:underline">
                      → Claim to add hours
                    </Link>
                  )}
                </div>
              )}
            </div>
            <StillOpenWidget storeId={store.id} lastVerified={store.last_verified_at || null} />

            {!store.is_claimed && (
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
                <div className="text-2xl mb-2">🏪</div>
                <h3 className="font-bold text-base mb-1">Is this your store?</h3>
                <p className="text-blue-100 text-xs mb-4 leading-relaxed">
                  Claim your free listing to update hours, add photos, respond to reviews, and post new arrivals.
                </p>
                <Link href={`/claim/${store.slug}`}
                  className="block text-center bg-white text-blue-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-blue-50 transition-all">
                  Claim This Listing — Free
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Footer } from '@/components/footer'
import { ClubsGrid } from '@/components/clubs-grid'
import Link from 'next/link'

const STATE_ABBR: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
  'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
  'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
  'new-hampshire': 'NH', 'new-jersey': 'NJ', 'new-mexico': 'NM', 'new-york': 'NY',
  'north-carolina': 'NC', 'north-dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
  'oregon': 'OR', 'pennsylvania': 'PA', 'rhode-island': 'RI', 'south-carolina': 'SC',
  'south-dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
  'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west-virginia': 'WV',
  'wisconsin': 'WI', 'wyoming': 'WY'
}

const STATE_NAMES: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming'
}

const FOCUS_COLORS: Record<string, string> = {
  reef:        'bg-blue-100 text-blue-800',
  saltwater:   'bg-cyan-100 text-cyan-800',
  freshwater:  'bg-green-100 text-green-800',
  planted:     'bg-lime-100 text-lime-800',
  general:     'bg-gray-100 text-gray-700',
  pond:        'bg-teal-100 text-teal-800',
  cichlid:     'bg-orange-100 text-orange-800',
  discus:      'bg-purple-100 text-purple-800',
}

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return Object.keys(STATE_ABBR).map((state) => ({ state }))
}

interface ClubsStatePageProps {
  params: Promise<{ state: string }>
}

export async function generateMetadata({ params }: ClubsStatePageProps) {
  const { state: stateSlug } = await params
  if (!STATE_ABBR[stateSlug.toLowerCase()]) notFound()
  const stateAbbr = STATE_ABBR[stateSlug.toLowerCase()]
  const stateName = STATE_NAMES[stateAbbr]

  return {
    title: `Aquarium Clubs in ${stateName} — Local Fish & Reef Clubs | LFSDirectory`,
    description: `Find local aquarium clubs and reef societies in ${stateName}. Browse freshwater, saltwater, reef, and planted tank clubs near you.`,
    openGraph: {
      title: `Aquarium Clubs in ${stateName} | LFSDirectory`,
      description: `Browse local aquarium clubs and reef societies in ${stateName}.`,
    },
  }
}

export default async function ClubsStatePage({ params }: ClubsStatePageProps) {
  const { state: stateSlug } = await params
  const normalized = stateSlug.toLowerCase()
  if (!STATE_ABBR[normalized]) notFound()

  const stateAbbr = STATE_ABBR[normalized]
  const stateName = STATE_NAMES[stateAbbr]

  // Fetch all active clubs for this state
  const { data: clubsData } = await supabase
    .from('clubs')
    .select('id, name, slug, city, state, website, facebook_url, focus, meeting_frequency, description, is_verified, member_count_approx, founded_year')
    .eq('state', stateAbbr)
    .eq('is_active', true)
    .order('name', { ascending: true })

  const clubs = clubsData || []

  // Fetch fish stores in this state for the bottom widget
  const { data: storesData } = await supabase
    .from('stores')
    .select('id, name, city, state, rating, slug, specialty_tags')
    .eq('state', stateAbbr)
    .eq('is_reviewed', true)
    .order('rating', { ascending: false })
    .limit(6)

  const stores = storesData || []

  // Build focus counts for the summary bar
  const focusCounts: Record<string, number> = {}
  clubs.forEach(club => {
    (club.focus || []).forEach((f: string) => {
      focusCounts[f] = (focusCounts[f] || 0) + 1
    })
  })

  return (
    <main className="w-full">

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-blue-200 mb-4 flex gap-2 items-center">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/clubs" className="hover:text-white">Clubs</Link>
            <span>/</span>
            <span className="text-white">{stateName}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Aquarium Clubs in {stateName}
          </h1>
          <p className="text-blue-100 text-lg">
            {clubs.length > 0
              ? `${clubs.length} aquarium ${clubs.length === 1 ? 'club' : 'clubs'} listed across ${stateName}`
              : `Be the first to add an aquarium club in ${stateName}`}
          </p>

          {/* Focus tag summary */}
          {Object.keys(focusCounts).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(focusCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([focus, count]) => (
                  <span key={focus} className="bg-white/20 text-white text-sm px-3 py-1 rounded-full capitalize">
                    {focus} ({count})
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {clubs.length === 0 ? (
          // Empty state
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">🐠</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No clubs listed yet in {stateName}</h2>
            <p className="text-gray-500 mb-6">Know of a local aquarium club or reef society? Add it free.</p>
            <Link
              href="/clubs/add"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Submit a Club
            </Link>
          </div>
        ) : (
          <ClubsGrid clubs={clubs} focusColors={FOCUS_COLORS} />
        )}

        {/* Fish Stores in this State widget */}
        {stores.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                🐟 Fish Stores in {stateName}
              </h2>
              <Link
                href={`/${normalized}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                View all stores →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map(store => (
                <Link
                  key={store.id}
                  href={`/${normalized}/${store.city?.toLowerCase().replace(/\s+/g, '-')}/${store.slug}`}
                  className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">{store.name}</h3>
                    {store.rating > 0 && (
                      <span className="text-yellow-500 text-sm font-medium ml-2 shrink-0">
                        ★ {Number(store.rating).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mb-2">{store.city}, {store.state}</p>
                  <div className="flex flex-wrap gap-1">
                    {(store.specialty_tags || []).slice(0, 3).map((tag: string) => (
                      <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Submit a Club CTA */}
        <div className="mt-14 bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Know a club we missed?</h2>
          <p className="text-gray-600 mb-5">
            Help the {stateName} aquarium community grow. Submit a local club or reef society — it&apos;s free.
          </p>
          <Link
            href="/clubs/add"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium inline-block"
          >
            Submit a Club
          </Link>
        </div>

      </div>

      <Footer />
    </main>
  )
}

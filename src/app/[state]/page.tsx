import { supabase } from '@/lib/supabase'
import { StateHeader } from '@/components/state-header'
import { SpecialtyFilterBarWrapper } from '@/components/specialty-filter-bar-wrapper'
import { CitiesGrid } from '@/components/cities-grid'
import { FeaturedStoresSection } from '@/components/featured-stores-section'
import { StateSummary } from '@/components/state-summary'
import { AddStoreCTA } from '@/components/add-store-cta'
import { Footer } from '@/components/footer'

// Map URL slugs to state abbreviations
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

export async function generateStaticParams() {
  return Object.keys(STATE_ABBR).map((state) => ({ state }))
}

export async function generateMetadata({ params }: StatePageProps) {
  const { state: stateSlug } = await params
  const stateAbbr = STATE_ABBR[stateSlug.toLowerCase()] || stateSlug.toUpperCase()
  const stateName = STATE_NAMES[stateAbbr] || stateSlug

  return {
    title: `Fish Stores in ${stateName} — Local Aquarium Shops | LFSDirectory`,
    description: `Find local fish stores and aquarium shops in ${stateName}. Browse by city, read reviews, and discover the best LFS near you.`,
    openGraph: {
      title: `Fish Stores in ${stateName} | LFSDirectory`,
      description: `Browse ${stateName}'s best local fish stores and aquarium shops by city.`,
    },
  }
}

interface StatePageProps {
  params: Promise<{ state: string }>
}

export default async function StatePage({ params }: StatePageProps) {
  const { state: stateSlug } = await params
  const stateAbbr = STATE_ABBR[stateSlug.toLowerCase()] || stateSlug.toUpperCase()
  const stateName = STATE_NAMES[stateAbbr] || stateSlug

  // Fetch cities with store counts
  const { data: cityData } = await supabase
    .from('stores')
    .select('city')
    .eq('state', stateAbbr)

  // Build city counts
  const cityCounts: Record<string, number> = {}
  cityData?.forEach(row => {
    if (row.city) {
      cityCounts[row.city] = (cityCounts[row.city] || 0) + 1
    }
  })

  const cities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, storeCount]) => ({
      name,
      storeCount,
      topSpecialty: 'Various'
    }))

  const storeCount = cityData?.length || 0
  const cityCount = cities.length

  // Fetch top rated stores for this state
  const { data: featuredStores } = await supabase
    .from('stores')
    .select('id, name, city, state, rating, review_count, specialty_tags, description, slug, is_verified')
    .eq('state', stateAbbr)
    .order('rating', { ascending: false })
    .limit(6)

  const stores = (featuredStores || []).map(s => ({
    id: s.id,
    name: s.name,
    city: s.city,
    state: stateSlug,
    slug: s.slug,
    rating: s.rating || 0,
    reviewCount: s.review_count || 0,
    specialties: s.specialty_tags || [],
    description: s.description || `A local fish store in ${s.city}, ${s.state}.`,
    claimed: s.is_verified || false,
  }))

  return (
    <main className="w-full">
      <StateHeader state={stateName} storeCount={storeCount} cityCount={cityCount} />
      <SpecialtyFilterBarWrapper />
      <CitiesGrid cities={cities} state={stateSlug.toLowerCase()} />
      <FeaturedStoresSection state={stateName} stores={stores} />
      <StateSummary
        state={stateName}
        storeCount={storeCount}
        topSpecialty="Saltwater & Reef"
        cityCount={cityCount}
        summaryHtml={`<p>${stateName} has ${storeCount} local fish stores across ${cityCount} cities listed in our directory.</p>`}
      />
      <AddStoreCTA />
      <Footer />
    </main>
  )
}
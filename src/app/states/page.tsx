import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Footer } from '@/components/footer'

const US_STATES: Record<string, { name: string; slug: string }> = {
  AL: { name: 'Alabama', slug: 'alabama' },
  AK: { name: 'Alaska', slug: 'alaska' },
  AZ: { name: 'Arizona', slug: 'arizona' },
  AR: { name: 'Arkansas', slug: 'arkansas' },
  CA: { name: 'California', slug: 'california' },
  CO: { name: 'Colorado', slug: 'colorado' },
  CT: { name: 'Connecticut', slug: 'connecticut' },
  DE: { name: 'Delaware', slug: 'delaware' },
  FL: { name: 'Florida', slug: 'florida' },
  GA: { name: 'Georgia', slug: 'georgia' },
  HI: { name: 'Hawaii', slug: 'hawaii' },
  ID: { name: 'Idaho', slug: 'idaho' },
  IL: { name: 'Illinois', slug: 'illinois' },
  IN: { name: 'Indiana', slug: 'indiana' },
  IA: { name: 'Iowa', slug: 'iowa' },
  KS: { name: 'Kansas', slug: 'kansas' },
  KY: { name: 'Kentucky', slug: 'kentucky' },
  LA: { name: 'Louisiana', slug: 'louisiana' },
  ME: { name: 'Maine', slug: 'maine' },
  MD: { name: 'Maryland', slug: 'maryland' },
  MA: { name: 'Massachusetts', slug: 'massachusetts' },
  MI: { name: 'Michigan', slug: 'michigan' },
  MN: { name: 'Minnesota', slug: 'minnesota' },
  MS: { name: 'Mississippi', slug: 'mississippi' },
  MO: { name: 'Missouri', slug: 'missouri' },
  MT: { name: 'Montana', slug: 'montana' },
  NE: { name: 'Nebraska', slug: 'nebraska' },
  NV: { name: 'Nevada', slug: 'nevada' },
  NH: { name: 'New Hampshire', slug: 'new-hampshire' },
  NJ: { name: 'New Jersey', slug: 'new-jersey' },
  NM: { name: 'New Mexico', slug: 'new-mexico' },
  NY: { name: 'New York', slug: 'new-york' },
  NC: { name: 'North Carolina', slug: 'north-carolina' },
  ND: { name: 'North Dakota', slug: 'north-dakota' },
  OH: { name: 'Ohio', slug: 'ohio' },
  OK: { name: 'Oklahoma', slug: 'oklahoma' },
  OR: { name: 'Oregon', slug: 'oregon' },
  PA: { name: 'Pennsylvania', slug: 'pennsylvania' },
  RI: { name: 'Rhode Island', slug: 'rhode-island' },
  SC: { name: 'South Carolina', slug: 'south-carolina' },
  SD: { name: 'South Dakota', slug: 'south-dakota' },
  TN: { name: 'Tennessee', slug: 'tennessee' },
  TX: { name: 'Texas', slug: 'texas' },
  UT: { name: 'Utah', slug: 'utah' },
  VT: { name: 'Vermont', slug: 'vermont' },
  VA: { name: 'Virginia', slug: 'virginia' },
  WA: { name: 'Washington', slug: 'washington' },
  WV: { name: 'West Virginia', slug: 'west-virginia' },
  WI: { name: 'Wisconsin', slug: 'wisconsin' },
  WY: { name: 'Wyoming', slug: 'wyoming' },
}

const REGIONS: Record<string, { label: string; states: string[] }> = {
  west: {
    label: '🌊 West',
    states: ['CA', 'OR', 'WA', 'NV', 'ID', 'MT', 'WY', 'CO', 'UT', 'AK', 'HI'],
  },
  southwest: {
    label: '🌵 Southwest',
    states: ['AZ', 'NM', 'TX', 'OK'],
  },
  midwest: {
    label: '🌽 Midwest',
    states: ['IL', 'IN', 'OH', 'MI', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'],
  },
  south: {
    label: '🌴 South',
    states: ['FL', 'GA', 'AL', 'MS', 'LA', 'AR', 'TN', 'KY', 'SC', 'NC', 'VA', 'WV', 'MD', 'DE'],
  },
  northeast: {
    label: '🗽 Northeast',
    states: ['NY', 'PA', 'NJ', 'CT', 'MA', 'RI', 'NH', 'VT', 'ME'],
  },
}

function getHeatColor(count: number, max: number): string {
  if (count === 0) return 'bg-gray-100 text-gray-400 border-gray-200'
  const pct = count / max
  if (pct >= 0.7) return 'bg-blue-700 text-white border-blue-800'
  if (pct >= 0.4) return 'bg-blue-500 text-white border-blue-600'
  if (pct >= 0.2) return 'bg-blue-300 text-blue-900 border-blue-400'
  return 'bg-blue-100 text-blue-800 border-blue-200'
}

export const metadata = {
  title: 'Browse Fish Stores by State — All 50 States | LFSDirectory',
  description:
    'Find local fish stores and aquarium shops in every US state. Browse all 50 states to discover the best LFS near you.',
}

export default async function StatesPage() {
  const { data: rows } = await supabase
    .from('stores')
    .select('state')
    .not('state', 'is', null)

  const stateCounts: Record<string, number> = {}
  rows?.forEach((r) => {
    if (r.state && US_STATES[r.state]) {
      stateCounts[r.state] = (stateCounts[r.state] || 0) + 1
    }
  })

  const totalStores = Object.values(stateCounts).reduce((a, b) => a + b, 0)
  const totalStatesWithStores = Object.keys(stateCounts).length
  const maxCount = Math.max(...Object.values(stateCounts), 1)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Browse Fish Stores by State
          </h1>
          <p className="text-blue-100 text-lg mb-6">
            {totalStores.toLocaleString()} aquarium stores listed across{' '}
            {totalStatesWithStores} states
          </p>
          <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-5 py-2 text-sm">
            <span className="text-blue-200">Fewer stores</span>
            <div className="flex gap-1">
              <span className="w-5 h-5 rounded bg-blue-100 border border-blue-200 inline-block" />
              <span className="w-5 h-5 rounded bg-blue-300 border border-blue-400 inline-block" />
              <span className="w-5 h-5 rounded bg-blue-500 border border-blue-600 inline-block" />
              <span className="w-5 h-5 rounded bg-blue-700 border border-blue-800 inline-block" />
            </div>
            <span className="text-blue-200">More stores</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

        {/* Top States Quick Links */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            🏆 Most Stores
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stateCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([abbr, count]) => {
                const s = US_STATES[abbr]
                if (!s) return null
                return (
                  <Link
                    key={abbr}
                    href={`/${s.slug}`}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                  >
                    <span className="font-bold text-blue-600">{abbr}</span>
                    <span>{s.name}</span>
                    <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                      {count}
                    </span>
                  </Link>
                )
              })}
          </div>
        </section>

        {/* Regional Sections */}
        {Object.entries(REGIONS).map(([regionKey, region]) => (
          <section key={regionKey}>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {region.label}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {region.states.map((abbr) => {
                const s = US_STATES[abbr]
                if (!s) return null
                const count = stateCounts[abbr] || 0
                const heatClass = getHeatColor(count, maxCount)
                return (
                  <Link
                    key={abbr}
                    href={`/${s.slug}`}
                    className={`group rounded-xl border-2 p-4 flex flex-col gap-1 transition-all hover:scale-105 hover:shadow-md ${heatClass}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold opacity-70">{abbr}</span>
                      {count > 0 && (
                        <span className="text-xs font-bold opacity-80">
                          {count} stores
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-sm leading-tight">
                      {s.name}
                    </span>
                    {count === 0 && (
                      <span className="text-xs opacity-50">Coming soon</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        ))}

        {/* Full A-Z List */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            📋 All States A–Z
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {Object.entries(US_STATES)
                .sort((a, b) => a[1].name.localeCompare(b[1].name))
                .map(([abbr, s]) => {
                  const count = stateCounts[abbr] || 0
                  return (
                    <Link
                      key={abbr}
                      href={`/${s.slug}`}
                      className="flex items-center justify-between px-5 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 w-6">
                          {abbr}
                        </span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          {s.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          count > 0
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {count > 0 ? `${count} stores` : '—'}
                      </span>
                    </Link>
                  )
                })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Don't see your store listed?</h2>
          <p className="text-blue-100 mb-5 text-sm">
            Add your local fish store for free — it takes 2 minutes.
          </p>
          <Link
            href="/add-store"
            className="inline-block bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-full hover:bg-blue-50 transition-colors"
          >
            Add a Store
          </Link>
        </section>

      </div>
      <Footer />
    </main>
  )
}

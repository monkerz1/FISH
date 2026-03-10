import { supabase } from '@/lib/supabase'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Aquarium Clubs by State — Local Fish & Reef Clubs | LFSDirectory',
  description: 'Find local aquarium clubs and reef societies near you. Browse freshwater, saltwater, reef, and planted tank clubs across all 50 states.',
}

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',
  CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',
  HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',
  KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',
  MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',
  NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',
  NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',
  OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
  SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',
  VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'
}

const STATE_SLUGS: Record<string, string> = {
  AL:'alabama',AK:'alaska',AZ:'arizona',AR:'arkansas',CA:'california',
  CO:'colorado',CT:'connecticut',DE:'delaware',FL:'florida',GA:'georgia',
  HI:'hawaii',ID:'idaho',IL:'illinois',IN:'indiana',IA:'iowa',KS:'kansas',
  KY:'kentucky',LA:'louisiana',ME:'maine',MD:'maryland',MA:'massachusetts',
  MI:'michigan',MN:'minnesota',MS:'mississippi',MO:'missouri',MT:'montana',
  NE:'nebraska',NV:'nevada',NH:'new-hampshire',NJ:'new-jersey',NM:'new-mexico',
  NY:'new-york',NC:'north-carolina',ND:'north-dakota',OH:'ohio',OK:'oklahoma',
  OR:'oregon',PA:'pennsylvania',RI:'rhode-island',SC:'south-carolina',
  SD:'south-dakota',TN:'tennessee',TX:'texas',UT:'utah',VT:'vermont',
  VA:'virginia',WA:'washington',WV:'west-virginia',WI:'wisconsin',WY:'wyoming'
}

export default async function ClubsIndexPage() {
  const { data: clubsData } = await supabase
    .from('clubs')
    .select('id, state, focus')
    .eq('is_active', true)

  const clubs = clubsData || []

  const byState: Record<string, { count: number; focuses: Set<string> }> = {}
  clubs.forEach(club => {
    if (!byState[club.state]) byState[club.state] = { count: 0, focuses: new Set() }
    byState[club.state].count++
    ;(club.focus || []).forEach((f: string) => byState[club.state].focuses.add(f))
  })

  const statesWithClubs = Object.entries(byState).sort((a, b) => b[1].count - a[1].count)
  const totalClubs = clubs.length
  const totalStates = statesWithClubs.length

  return (
    <main className="w-full">
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Aquarium Clubs Directory</h1>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Find local aquarium clubs, reef societies, and fish keeping groups near you.
          </p>
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">{totalClubs}</div>
              <div className="text-blue-200 text-sm">Clubs Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{totalStates}</div>
              <div className="text-blue-200 text-sm">States Covered</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {statesWithClubs.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Browse by State</h2>
              <Link href="/clubs/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                + Submit a Club
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {statesWithClubs.map(([abbr, data]) => (
                <Link
                  key={abbr}
                  href={`/clubs/${STATE_SLUGS[abbr]}`}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {STATE_NAMES[abbr]}
                    </h3>
                    <span className="bg-blue-50 text-blue-700 text-sm font-medium px-2 py-0.5 rounded-full">
                      {data.count} {data.count === 1 ? 'club' : 'clubs'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(data.focuses).slice(0, 3).map(f => (
                      <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{f}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">🐠</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No clubs listed yet</h2>
            <p className="text-gray-500 mb-6">Be the first to submit a local aquarium club.</p>
          </div>
        )}

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Know a club we missed?</h2>
          <p className="text-gray-600 mb-5">Help the aquarium community grow. Submit a local club or reef society — it's free.</p>
          <Link href="/clubs/add" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium inline-block">
            Submit a Club
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}

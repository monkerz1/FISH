import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Footer } from '@/components/footer'
import { Star, MapPin, Phone, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const STATE_ABBR: Record<string, string> = {
  'alabama':'AL','alaska':'AK','arizona':'AZ','arkansas':'AR','california':'CA',
  'colorado':'CO','connecticut':'CT','delaware':'DE','florida':'FL','georgia':'GA',
  'hawaii':'HI','idaho':'ID','illinois':'IL','indiana':'IN','iowa':'IA','kansas':'KS',
  'kentucky':'KY','louisiana':'LA','maine':'ME','maryland':'MD','massachusetts':'MA',
  'michigan':'MI','minnesota':'MN','mississippi':'MS','missouri':'MO','montana':'MT',
  'nebraska':'NE','nevada':'NV','new-hampshire':'NH','new-jersey':'NJ','new-mexico':'NM',
  'new-york':'NY','north-carolina':'NC','north-dakota':'ND','ohio':'OH','oklahoma':'OK',
  'oregon':'OR','pennsylvania':'PA','rhode-island':'RI','south-carolina':'SC',
  'south-dakota':'SD','tennessee':'TN','texas':'TX','utah':'UT','vermont':'VT',
  'virginia':'VA','washington':'WA','west-virginia':'WV','wisconsin':'WI','wyoming':'WY'
}

interface CityPageProps {
  params: Promise<{ state: string; city: string }>
}

export default async function CityPage({ params }: CityPageProps) {
  const { state: stateSlug, city: citySlug } = await params
  const stateAbbr = STATE_ABBR[stateSlug.toLowerCase()] || stateSlug.toUpperCase()
  const cityName = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const { data: stores } = await supabase
    .from('stores')
    .select('id, name, city, state, slug, rating, review_count, specialty_tags, phone, website, address, description')
    .eq('state', stateAbbr)
    .ilike('city', cityName)
    .eq('is_reviewed', true)
    .order('rating', { ascending: false })

  const storeList = stores || []

  return (
    <main className="w-full min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">

        <nav className="text-sm text-muted-foreground mb-6 flex gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>›</span>
          <Link href={'/' + stateSlug} className="hover:text-primary capitalize">{stateSlug}</Link>
          <span>›</span>
          <span className="text-foreground">{cityName}</span>
        </nav>

        <h1 className="text-4xl font-bold mb-2">Fish Stores in {cityName}</h1>
        <p className="text-muted-foreground mb-10">
          {storeList.length} aquarium and fish {storeList.length === 1 ? 'store' : 'stores'} in {cityName}, {stateAbbr}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {storeList.map(store => (
            <Link key={store.id} href={'/' + stateSlug + '/' + citySlug + '/' + store.slug} className="block group">
              <div className="rounded-lg border border-border bg-card p-6 hover:border-primary hover:shadow-md transition-all">
                <h2 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
                  {store.name}
                </h2>

                {store.rating > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={'h-4 w-4 ' + (i < Math.floor(store.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{store.rating}</span>
                    <span className="text-sm text-muted-foreground">({store.review_count})</span>
                  </div>
                )}

                {store.specialty_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {store.specialty_tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}

                <div className="space-y-1 text-sm text-muted-foreground">
                  {store.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>{store.address}</span>
                    </div>
                  )}
                  {store.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                  )}
                  {store.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 shrink-0" />
                      <span className="truncate">{store.website.replace(/^https?:\/\//, '')}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {storeList.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No stores found in {cityName}. <Link href="/add-store" className="text-primary hover:underline">Add one!</Link>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
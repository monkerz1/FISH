import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Footer } from '@/components/footer'
import { Star, MapPin, Phone, Globe, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import StillOpenWidget from '@/components/StillOpenWidget'

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

export default async function StorePage({ params }: StorePageProps) {
  const { state: stateSlug, city: citySlug, slug } = await params

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!store) notFound()

  const cityName = citySlug
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const mapsQuery = encodeURIComponent(
    store.address + ', ' + store.city + ', ' + store.state
  )
  const mapsUrl = 'https://maps.google.com/?q=' + mapsQuery

  return (
    <main className="w-full min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">

        <nav className="text-sm text-muted-foreground mb-6 flex gap-2 flex-wrap">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>›</span>
          <Link href={'/' + stateSlug} className="hover:text-primary capitalize">{stateSlug}</Link>
          <span>›</span>
          <Link href={'/' + stateSlug + '/' + citySlug} className="hover:text-primary">{cityName}</Link>
          <span>›</span>
          <span className="text-foreground">{store.name}</span>
        </nav>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">{store.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{store.address}</span>
            </div>
          </div>
          {store.is_verified && (
            <div className="flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-3 py-1.5 shrink-0">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Verified</span>
            </div>
          )}
        </div>

        {store.rating > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={'h-5 w-5 ' + (i < Math.floor(store.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
              ))}
            </div>
            <span className="font-semibold">{store.rating}</span>
            <span className="text-muted-foreground">({store.review_count} reviews)</span>
          </div>
        )}

        {store.specialty_tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {store.specialty_tags.map((tag: string) => (
              <Badge key={tag} className="bg-blue-50 text-blue-800">{tag}</Badge>
            ))}
          </div>
        )}

        <div className="rounded-lg border border-border bg-card p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Contact and Location</h2>
          <div className="space-y-3">
            {store.phone && (
              <a href={'tel:' + store.phone} className="flex items-center gap-3 text-foreground hover:text-primary">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{store.phone}</span>
              </a>
            )}
            {store.website && (
              <a href={store.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span className="truncate">{store.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {store.address && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{store.address}</span>
              </a>
            )}
          </div>
          <Button className="w-full mt-4" asChild>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Get Directions
            </a>
          </Button>
        </div>

        {store.description && (
          <div className="rounded-lg border border-border bg-card p-6 mb-6">
            <h2 className="font-semibold text-lg mb-2">About</h2>
            <p className="text-muted-foreground">{store.description}</p>
          </div>
        )}

        {/* STILL OPEN WIDGET */}
        <div className="mb-6">
          <StillOpenWidget
            storeId={store.id}
            lastVerified={store.last_verified_at || null}
          />
        </div>

        {!store.is_claimed && (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center">
            <h3 className="font-semibold mb-1">Is this your store?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Claim this listing for free to update your info and respond to reviews.
            </p>
            <Button variant="outline" asChild>
              <Link href={'/claim/' + store.slug}>Claim This Listing</Link>
            </Button>
          </div>
        )}

      </div>
      <Footer />
    </main>
  )
}
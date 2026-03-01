import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CHAIN_BLOCKLIST = ['walmart', 'tractor supply', 'target', 'shedd aquarium', 'wild reef', 'h mart', 'fresh market', 'grocery']

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const radius = parseFloat(searchParams.get('radius') || '25')

  if (!query) {
    return NextResponse.json({ results: [], total: 0 })
  }

  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', USA')}&format=json&limit=1`
    const geocodeRes = await fetch(nominatimUrl, {
      headers: { 'User-Agent': 'LFSDirectory/1.0 (lfsdirectory.com)' }
    })
    const geocodeData = await geocodeRes.json()

    if (!geocodeData.length) {
      return NextResponse.json({ results: [], total: 0, error: 'Location not found' })
    }

    const lat = parseFloat(geocodeData[0].lat)
    const lng = parseFloat(geocodeData[0].lon)

    const { data, error } = await supabase.rpc('search_stores_near', {
      user_lat: lat,
      user_lng: lng,
      radius_miles: radius
    })

    if (error) {
      console.error('Supabase RPC error:', error)
      return NextResponse.json({ results: [], total: 0, error: error.message })
    }

    const filtered = (data || []).filter((store: any) => {
      const nameLower = store.name.toLowerCase()
      const isChain = CHAIN_BLOCKLIST.some(chain => nameLower.includes(chain))
      return !isChain && store.is_reviewed === true
    })

    return NextResponse.json({
      results: filtered,
      total: filtered.length,
      location: { lat, lng, label: geocodeData[0].display_name }
    })

  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json({ results: [], total: 0, error: 'Search failed' }, { status: 500 })
  }
}

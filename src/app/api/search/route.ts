import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const radius = parseFloat(searchParams.get('radius') || '25')

  if (!query) {
    return NextResponse.json({ results: [], total: 0 })
  }

  // Try geocoding the query
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query + ', USA')}&key=${process.env.GOOGLE_PLACES_API_KEY}`
  
  try {
    const geocodeRes = await fetch(geocodeUrl)
    const geocodeData = await geocodeRes.json()

    if (!geocodeData.results?.length) {
      return NextResponse.json({ results: [], total: 0, error: 'Location not found' })
    }

    const { lat, lng } = geocodeData.results[0].geometry.location

    const { data, error } = await supabase.rpc('search_stores_near', {
      user_lat: lat,
      user_lng: lng,
      radius_miles: radius
    })

    if (error) {
      console.error('Supabase RPC error:', error)
      return NextResponse.json({ results: [], total: 0, error: error.message })
    }

    return NextResponse.json({
      results: data || [],
      total: (data || []).length,
      location: { lat, lng, label: geocodeData.results[0].formatted_address }
    })

  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json({ results: [], total: 0, error: 'Search failed' }, { status: 500 })
  }
}

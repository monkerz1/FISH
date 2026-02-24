import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()

  const { storeName, address, city, state, zip, phone, website, specialties } = body

  if (!storeName || !city || !state) {
    return NextResponse.json({ error: 'Name, city, and state are required' }, { status: 400 })
  }

  const slug = `${storeName}-${city}-${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Date.now()

  const { data, error } = await supabase
    .from('stores')
    .insert([{
      name: storeName,
      slug,
      address: address || null,
      city,
      state,
      zip: zip || null,
      phone: phone || null,
      website: website || null,
      specialty_tags: specialties || [],
      is_claimed: false,
      is_verified: false,
      verification_status: 'pending_review',
      listing_tier: 'free',
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, store: data })
}

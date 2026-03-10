import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, city, state, website, facebook_url, email, focus, meeting_frequency, description } = body
    if (!name?.trim() || !city?.trim() || !state) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const { error } = await supabase.from('clubs').insert({
      name: name.trim(),
      slug: slugify(name.trim()),
      city: city.trim(),
      state,
      website: website?.trim() || null,
      facebook_url: facebook_url?.trim() || null,
      email: email?.trim() || null,
      focus: focus || [],
      meeting_frequency: meeting_frequency?.trim() || null,
      description: description?.trim() || null,
      is_active: false,
      is_verified: false,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const resourceName = searchParams.get('resource')
  const maxWidth = searchParams.get('maxWidth') || '800'

  if (!resourceName) {
    return NextResponse.json({ error: 'Missing resource' }, { status: 400 })
  }

  // Create a safe filename from the resource name
  const safeKey = `${maxWidth}/${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`

  // Check if already cached in Supabase Storage
  const { data: existingFile } = await supabase.storage
    .from('store-photos')
    .getPublicUrl(safeKey)

  if (existingFile?.publicUrl) {
    // Check if the file actually exists
    const checkRes = await fetch(existingFile.publicUrl, { method: 'HEAD' })
    if (checkRes.ok) {
      return NextResponse.redirect(existingFile.publicUrl)
    }
  }

  // Not cached — fetch from Google
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const googleUrl = `https://places.googleapis.com/v1/${resourceName}/media?maxWidthPx=${maxWidth}&skipHttpRedirect=true&key=${apiKey}`

  try {
    const res = await fetch(googleUrl)
    if (!res.ok) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }
    const data = await res.json()
    if (!data.photoUri) {
      return NextResponse.json({ error: 'No photo URI' }, { status: 404 })
    }

    // Download the actual image
    const imgRes = await fetch(data.photoUri)
    if (!imgRes.ok) {
      return NextResponse.redirect(data.photoUri)
    }

    const imgBuffer = await imgRes.arrayBuffer()

    // Upload to Supabase Storage
    await supabase.storage
      .from('store-photos')
      .upload(safeKey, imgBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    // Get the public URL and redirect
    const { data: uploadedFile } = supabase.storage
      .from('store-photos')
      .getPublicUrl(safeKey)

    return NextResponse.redirect(uploadedFile.publicUrl)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 })
  }
}

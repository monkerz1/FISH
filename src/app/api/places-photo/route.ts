import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const resourceName = searchParams.get('resource')
  const maxWidth = searchParams.get('maxWidth') || '800'

  if (!resourceName) {
    return NextResponse.json({ error: 'Missing resource' }, { status: 400 })
  }

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
    // Redirect to the actual photo URL
    return NextResponse.redirect(data.photoUri)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 })
  }
}

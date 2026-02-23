import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { store_id, verification_type, notes } = body

    if (!store_id || !verification_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['still_open', 'report_closed', 'visited'].includes(verification_type)) {
      return NextResponse.json({ error: 'Invalid verification type' }, { status: 400 })
    }

    // Get IP for rate limiting (no personal data stored)
    const forwarded = request.headers.get('x-forwarded-for')
    const user_ip = forwarded ? forwarded.split(',')[0] : 'unknown'

    // Rate limit: 1 verification per store per IP per 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: existing } = await supabase
      .from('store_verifications')
      .select('id')
      .eq('store_id', store_id)
      .eq('user_ip', user_ip)
      .gte('submitted_at', oneDayAgo)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'You already submitted a verification for this store today.' },
        { status: 429 }
      )
    }

    // Insert verification
    const { error } = await supabase
      .from('store_verifications')
      .insert({ store_id, verification_type, user_ip, notes: notes || null })

    if (error) throw error

    // If reported closed, flag the store for admin review
    if (verification_type === 'report_closed') {
      await supabase
        .from('stores')
        .update({ verification_status: 'flagged_closed' })
        .eq('id', store_id)
    }

    // Get updated confirmation count
    const { data: countData } = await supabase
      .rpc('get_open_confirmations', { store_uuid: store_id })

    return NextResponse.json({
      success: true,
      message: verification_type === 'still_open'
        ? 'Thanks for confirming!'
        : 'Thanks for the report. We\'ll review this store.',
      confirmations: countData || 0
    })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Failed to submit verification' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const store_id = searchParams.get('store_id')

  if (!store_id) {
    return NextResponse.json({ error: 'store_id required' }, { status: 400 })
  }

  const { data: count } = await supabase
    .rpc('get_open_confirmations', { store_uuid: store_id })

  return NextResponse.json({ confirmations: count || 0 })
}
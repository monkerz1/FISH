import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { name, email, role, phone, tenure, notes, storeSlug } = await request.json()

    // Find the store by slug
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id, name')
      .eq('slug', storeSlug)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')

    // Insert claim record
    const { error: claimError } = await supabase
      .from('store_claims')
      .insert({
        store_id: store.id,
        claimant_name: name,
        claimant_email: email,
        claimant_role: role,
        claimant_phone: phone,
        verification_token: token,
        status: 'pending',
      })

    if (claimError) {
      console.error('Claim insert error:', claimError)
      return NextResponse.json({ error: 'Failed to submit claim' }, { status: 500 })
    }

    // TODO: Send verification email via Resend
    // For now just log the token
    console.log(`Verification token for ${email}: ${token}`)
    console.log(`Verify URL: ${process.env.NEXT_PUBLIC_SITE_URL}/api/claims/verify?token=${token}`)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { claimId, storeId } = await request.json()

    if (!claimId || !storeId) {
      return NextResponse.json({ error: 'Missing claimId or storeId' }, { status: 400 })
    }

    // Update the claim status to revoked
    const { error: claimError } = await supabase
      .from('store_claims')
      .update({ status: 'revoked' })
      .eq('id', claimId)

    if (claimError) {
      return NextResponse.json({ error: claimError.message }, { status: 500 })
    }

    // Remove ownership from the store
    const { error: storeError } = await supabase
      .from('stores')
      .update({
        is_claimed: false,
        owner_user_id: null,
        claimed_at: null,
      })
      .eq('id', storeId)

    if (storeError) {
      return NextResponse.json({ error: storeError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}

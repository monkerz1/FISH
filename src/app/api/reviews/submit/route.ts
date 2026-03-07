import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      store_id,
      display_name,
      overall_rating,
      livestock_health,
      staff_knowledge,
      quarantine_practices,
      price_fairness,
      review_text,
    } = body

    if (!store_id || !display_name || !overall_rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { error } = await supabase.from('reviews').insert({
      store_id,
      display_name,
      overall_rating,
      livestock_health: livestock_health || null,
      staff_knowledge: staff_knowledge || null,
      quarantine_practices: quarantine_practices || null,
      price_fairness: price_fairness || null,
      review_text: review_text || null,
      is_approved: false,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
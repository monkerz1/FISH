import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { id, action } = await req.json()

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 })
    }

    if (action === 'approve') {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', id)
      if (error) throw error
    } else if (action === 'reject') {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)
      if (error) throw error
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
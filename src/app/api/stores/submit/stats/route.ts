import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { count } = await supabase
    .from('stores')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  return NextResponse.json({ count: count ?? 0 })
}
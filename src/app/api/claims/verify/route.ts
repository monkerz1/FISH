import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?claim=invalid`)
  }

  const { data, error } = await supabase
    .from('store_claims')
    .update({ email_verified: true })
    .eq('verification_token', token)
    .eq('email_verified', false)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?claim=invalid`)
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?claim=verified`)
}
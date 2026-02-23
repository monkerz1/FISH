import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/claims/verify?token=${token}`

    await resend.emails.send({
      from: 'LFS Directory <noreply@lfsdirectory.com>',
      to: email,
      subject: `Verify your claim for ${store.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4A90D9;">Verify Your Listing Claim</h2>
          <p>Hi ${name},</p>
          <p>Thanks for submitting a claim for <strong>${store.name}</strong>.</p>
          <p>Click the button below to verify your email address:</p>
          <a href="${verifyUrl}" style="display:inline-block; background:#4A90D9; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; margin:16px 0;">
            Verify My Email
          </a>
          <p style="color:#666; font-size:14px;">After verification, we'll review your claim within 48 hours and notify you at this email.</p>
          <p style="color:#999; font-size:12px;">If you didn't submit this claim, you can ignore this email.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

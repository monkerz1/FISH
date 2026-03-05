import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { claimId, storeId, claimantEmail, claimantName, storeName } = await request.json()

    // 1. Invite the user via Supabase Auth (creates account + sends magic link)
    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
      claimantEmail,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/store-owner/dashboard`,
      }
    )

    if (inviteError) {
      console.error('Invite error:', inviteError)
      return NextResponse.json({ error: 'Failed to invite user' }, { status: 500 })
    }

    const userId = inviteData.user.id

    // 2. Mark claim as approved
    await supabase
      .from('store_claims')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', claimId)

    // 3. Mark store as claimed and link owner_user_id
    await supabase
      .from('stores')
      .update({
        is_claimed: true,
        claimed_at: new Date().toISOString(),
        verification_status: 'owner_verified',
        owner_user_id: userId,
      })
      .eq('id', storeId)

    // 4. Send approval notification email
    await resend.emails.send({
      from: 'LFS Directory <noreply@lfsdirectory.com>',
      to: claimantEmail,
      subject: `Your claim for ${storeName} has been approved!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4A90D9;">Your Listing Claim is Approved! 🎉</h2>
          <p>Hi ${claimantName},</p>
          <p>Great news — your claim for <strong>${storeName}</strong> has been approved.</p>
          <p>Click the button below to set up your owner account and start managing your listing:</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/store-owner/dashboard" 
             style="display:inline-block; background:#4A90D9; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; margin:16px 0;">
            Set Up Your Account
          </a>
          <p style="color:#666; font-size:14px;">Check your email for a separate login link from us. Once logged in, you can:</p>
          <ul style="color:#666; font-size:14px;">
            <li>Update your store description</li>
            <li>Edit your specialty tags</li>
            <li>Update your hours</li>
          </ul>
          <p style="color:#999; font-size:12px;">Questions? Reply to this email.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
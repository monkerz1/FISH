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

    // 1. Create the user if they don't exist yet (no email sent by Supabase)
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: claimantEmail,
      email_confirm: true, // mark as confirmed so they don't get a separate confirm email
    })

    if (createError && createError.message !== 'A user with this email address has already been registered') {
      console.error('Create user error:', createError)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // 2. Get the user (whether just created or already existed)
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) {
      return NextResponse.json({ error: 'Failed to list users' }, { status: 500 })
    }
    const user = users.find(u => u.email === claimantEmail)
    if (!user) {
      return NextResponse.json({ error: 'User not found after creation' }, { status: 500 })
    }

    const userId = user.id

    // 3. Generate a magic link for them (no email sent by Supabase)
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: claimantEmail,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/store-owner/dashboard`,
      },
    })

    if (linkError) {
      console.error('Magic link error:', linkError)
      return NextResponse.json({ error: 'Failed to generate login link' }, { status: 500 })
    }

    const actionLink = linkData.properties?.action_link
    const token_hash = linkData.properties?.hashed_token
    const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?token_hash=${token_hash}&type=magiclink&next=/store-owner/dashboard`

    // 4. Mark claim as approved
    await supabase
      .from('store_claims')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', claimId)

    // 5. Mark store as claimed and link owner_user_id
    await supabase
      .from('stores')
      .update({
        is_claimed: true,
        claimed_at: new Date().toISOString(),
        verification_status: 'owner_verified',
        owner_user_id: userId,
      })
      .eq('id', storeId)

    // 6. Send ONE nice approval email with the magic link embedded
    await resend.emails.send({
      from: 'LFS Directory <noreply@lfsdirectory.com>',
      to: claimantEmail,
      subject: `Your claim for ${storeName} has been approved!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4A90D9;">Your Listing Claim is Approved! 🎉</h2>
          <p>Hi ${claimantName},</p>
          <p>Great news — your claim for <strong>${storeName}</strong> has been approved.</p>
          <p>Click the button below to log in and start managing your listing:</p>
          <a href="${magicLink}" 
             style="display:inline-block; background:#4A90D9; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; margin:16px 0;">
            Access Your Store Dashboard
          </a>
          <p style="color:#666; font-size:14px;">Once logged in, you can:</p>
          <ul style="color:#666; font-size:14px;">
            <li>Update your store description</li>
            <li>Edit your specialty tags</li>
            <li>Update your hours</li>
          </ul>
          <p style="color:#999; font-size:12px;">This login link expires in 24 hours. After that, visit <a href="${process.env.NEXT_PUBLIC_SITE_URL}/store-owner/login">your login page</a> to get a new one.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
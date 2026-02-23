import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

// Map full state names to abbreviations
const STATE_ABBR: Record<string, string> = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS',
  'Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA',
  'Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT',
  'Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM',
  'New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
  'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
  'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
  'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY'
}

function generateSlug(name: string, city: string, state: string): string {
  const base = `${name}-${city}-${state}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  return `${base}-${Date.now()}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['storeName','streetAddress','city','state','zip','yourName','yourEmail']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.yourEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (!/^\d{5}$/.test(body.zip)) {
      return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400 })
    }

    if (!body.specialties || body.specialties.length === 0) {
      return NextResponse.json({ error: 'At least one specialty must be selected' }, { status: 400 })
    }

    const stateAbbr = STATE_ABBR[body.state] || body.state
    const slug = generateSlug(body.storeName, body.city, stateAbbr)

    // Save to Supabase
    const { data: store, error: dbError } = await supabase
      .from('stores')
      .insert({
        name: body.storeName,
        address: `${body.streetAddress}, ${body.city}, ${stateAbbr} ${body.zip}`,
        city: body.city,
        state: stateAbbr,
        phone: body.phone || null,
        website: body.website || null,
        specialty_tags: body.specialties,
        services: body.services || [],
        slug: slug,
        is_verified: false,
        is_claimed: false,
        verification_status: 'pending_review',
        description: body.notes || null,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to save store' }, { status: 500 })
    }

    // Send confirmation email to submitter
    await resend.emails.send({
      from: 'LFS Directory <onboarding@resend.dev>',
      to: body.yourEmail,
      subject: `Thanks for submitting ${body.storeName}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4A90D9;">Thanks for your submission, ${body.yourName}!</h2>
          <p>We've received your submission for <strong>${body.storeName}</strong> in ${body.city}, ${stateAbbr}.</p>
          <div style="background: #f0f7ff; border-left: 4px solid #4A90D9; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0;"><strong>Store:</strong> ${body.storeName}</p>
            <p style="margin: 8px 0 0;"><strong>Address:</strong> ${body.streetAddress}, ${body.city}, ${stateAbbr} ${body.zip}</p>
            <p style="margin: 8px 0 0;"><strong>Specialties:</strong> ${body.specialties.join(', ')}</p>
          </div>
          <p>We'll review your submission within 48 hours. Once approved, the store will appear in our directory.</p>
          ${body.isOwner === 'yes' ? `<p>Since you're the owner, you'll be able to claim and manage this listing once it's approved. Visit <a href="https://lfsdirectory.com">LFSDirectory.com</a> to claim it.</p>` : ''}
          <p style="color: #666; font-size: 14px;">— The LFS Directory Team</p>
        </div>
      `
    })

    // Send admin notification email to yourself
    await resend.emails.send({
      from: 'LFS Directory <onboarding@resend.dev>',
      to: 'killerpings@gmail.com',
      subject: `New Store Submission: ${body.storeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4A90D9;">New Store Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Store Name</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.storeName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Address</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.streetAddress}, ${body.city}, ${stateAbbr} ${body.zip}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Website</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.website || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Specialties</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.specialties.join(', ')}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Is Owner?</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.isOwner === 'yes' ? 'Yes' : 'No'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Submitted By</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.yourName} (${body.yourEmail})</td></tr>
            <tr><td style="padding: 8px;"><strong>Notes</strong></td><td style="padding: 8px;">${body.notes || 'None'}</td></tr>
          </table>
          <p style="margin-top: 20px;">
            <a href="https://supabase.com/dashboard" style="background: #4A90D9; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none;">Review in Supabase</a>
          </p>
        </div>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'Store submitted successfully',
      data: { storeName: body.storeName, city: body.city, state: stateAbbr }
    })

  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 })
  }
}
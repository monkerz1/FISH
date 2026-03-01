import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, captchaToken } = await req.json()

    // Validate required fields
    if (!name || !email || !message || !captchaToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify reCAPTCHA
    const captchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
    })
    const captchaData = await captchaRes.json()

    if (!captchaData.success) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
    }

    // Send email via Resend
    await resend.emails.send({
      from: 'LFSDirectory Contact <noreply@lfsdirectory.com>',
      to: process.env.CONTACT_EMAIL_TO!,
      replyTo: email,
      subject: `[LFSDirectory Contact] ${subject || 'New message'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
        <hr />
        <small>Sent from LFSDirectory.com contact form</small>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Store submission received:', {
      storeName: body.storeName,
      city: body.city,
      state: body.state,
      email: body.yourEmail,
    });

    // Validate required fields
    const requiredFields = [
      'storeName',
      'streetAddress',
      'city',
      'state',
      'zip',
      'yourName',
      'yourEmail',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.yourEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate ZIP code
    if (!/^\d{5}$/.test(body.zip)) {
      return NextResponse.json(
        { error: 'Invalid ZIP code' },
        { status: 400 }
      );
    }

    // Validate at least one specialty
    if (!body.specialties || body.specialties.length === 0) {
      return NextResponse.json(
        { error: 'At least one specialty must be selected' },
        { status: 400 }
      );
    }

    // TODO: In a real implementation, you would:
    // 1. Save to database
    // 2. Send verification email to yourEmail
    // 3. Notify admin for review
    // 4. Check for duplicates

    return NextResponse.json(
      {
        success: true,
        message: 'Store submission received successfully',
        data: {
          storeName: body.storeName,
          city: body.city,
          state: body.state,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing store submission:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

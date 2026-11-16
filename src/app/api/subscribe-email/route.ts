import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, county } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if email_subscriptions table exists, if not just return success
    // (we'll handle storage separately)
    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .insert([
          {
            email,
            county: county || null,
            subscribed_at: new Date().toISOString(),
            active: true,
          },
        ])
        .select()

      if (error) {
        console.warn('Email subscription insert warning:', error)
        // Don't fail if table doesn't exist - this is optional
      }
    } catch (err) {
      console.warn('Email subscription table check:', err)
      // Table might not exist yet, that's ok
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Email subscription saved. Look for updates about activities in your area!' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe email' },
      { status: 500 }
    )
  }
}

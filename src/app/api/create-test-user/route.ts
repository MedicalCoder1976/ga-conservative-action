import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Create test user with email/password
    const { data, error: authError } = await supabase.auth.admin.createUser({
      email: 'testuser@gaissues.local',
      password: 'testpass123',
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        username: 'testuser',
        full_name: 'Test User',
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!data || !data.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    const user = data.user

    // Create profile for the user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username: 'testuser',
        full_name: 'Test User',
        county: 'Fulton',
        role: 'Visitor',
        show_real_name: false,
        points: 0,
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't fail - user was created, profile insert might fail due to RLS
    }

    return NextResponse.json({
      message: 'Test user created successfully',
      user: {
        id: user.id,
        email: 'testuser@gaissues.local',
        username: 'testuser',
      },
    })
  } catch (error) {
    console.error('Error creating test user:', error)
    return NextResponse.json(
      { error: 'Failed to create test user' },
      { status: 500 }
    )
  }
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('error', error)
    if (errorDescription) {
      redirectUrl.searchParams.set('error_description', errorDescription)
    }
    return NextResponse.redirect(redirectUrl)
  }

  if (code) {
    try {
      const supabase = await createClient()
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client')
      }
      
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Exchange code error:', exchangeError)
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('error', 'auth_error')
        redirectUrl.searchParams.set('error_description', exchangeError.message)
        return NextResponse.redirect(redirectUrl)
      }
      
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (err) {
      console.error('Callback error:', err)
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('error', 'callback_error')
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.redirect(new URL('/auth/login', request.url))
}


'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AlertCircle } from 'lucide-react'

export default function LoginPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loginMode, setLoginMode] = useState<'oauth' | 'password'>('password') // Default to password for now
  const supabase = createClient()

  // Check for errors from OAuth callback
  useEffect(() => {
    const errorParam = searchParams.get('error')
    const errorDesc = searchParams.get('error_description')
    
    if (errorParam) {
      let errorMessage = 'Authentication failed'
      if (errorParam === 'auth_error' && errorDesc) {
        errorMessage = errorDesc
      } else if (errorParam === 'access_denied') {
        errorMessage = 'Access denied. Please try again.'
      } else if (errorParam === 'server_error') {
        errorMessage = 'Server error during authentication. Please try again.'
      }
      setError(errorMessage)
    }
  }, [searchParams])

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // If no credentials provided, allow guest access
      if (!username && !password) {
        // Create anonymous session or redirect to dashboard
        console.log('🔐 Guest access - redirecting to dashboard')
        router.push('/dashboard')
        return
      }

      // Support both email and username login
      let email = username
      
      // If username doesn't contain @, treat it as a username and convert to email
      if (!email.includes('@')) {
        email = username + '@gaissues.local'
      }
      
      console.log('🔐 Attempting login with email:', email)
      
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('📊 Login response:', { success: !error, error: error?.message })
      
      if (error) {
        console.error('❌ Auth error:', error)
        throw error
      }
      
      console.log('✅ Login successful, redirecting...')
      
      // Redirect to homepage or dashboard
      router.push('/')
    } catch (err: any) {
      console.error('❌ Exception:', err)
      setError(err.message || 'Failed to sign in. Check your email/username and password.')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestAccess = () => {
    setLoading(true)
    // Redirect to dashboard without authentication
    router.push('/dashboard')
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setSuccess(true)
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with email')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'apple' | 'facebook') => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
        },
      })
      if (error) {
        console.error('OAuth error:', error)
        throw error
      }
    } catch (err: any) {
      console.error('OAuth exception:', err)
      setError(
        err.message ||
        `Failed to connect with ${provider}. Make sure it's configured in Supabase console.`
      )
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white">
      {/* Header with Back Button */}
      <header className="border-b-2 border-red-600 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">GA</div>
            <h1 className="text-2xl font-bold text-slate-900">GA Issues</h1>
          </div>
          <a href="/" className="text-red-600 hover:text-red-700 font-semibold transition text-lg">
            ← Back
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <Card className="w-full max-w-md bg-white border-red-600 border-2 shadow-lg">
          <CardHeader className="text-center border-b-2 border-red-600 pb-6">
            <CardTitle className="text-3xl font-black text-slate-900 mb-2">
              Join GA Issues
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Track local issues and stay informed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg flex gap-3 border-2 border-red-600">
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5 font-bold" />
                <p className="text-base font-semibold">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-red-50 text-red-800 p-4 rounded-lg border-2 border-red-600">
                <p className="text-base font-bold">✓ Check your email for a sign-in link!</p>
              </div>
            )}

            {/* Login Mode Tabs */}
            <div className="flex gap-2 border-b-2 border-red-600">
              <button
                onClick={() => setLoginMode('password')}
                className={`px-4 py-3 font-bold text-lg transition ${
                  loginMode === 'password'
                    ? 'border-b-2 border-red-600 text-red-600 -mb-0.5'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setLoginMode('oauth')}
                className={`px-4 py-3 font-bold text-lg transition ${
                  loginMode === 'oauth'
                    ? 'border-b-2 border-red-600 text-red-600 -mb-0.5'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Social Login <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded ml-2 font-bold">Coming Soon</span>
              </button>
            </div>

            {/* Password Login Form */}
            {loginMode === 'password' && (
              <>
                <form onSubmit={handlePasswordSignIn} className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-bold mb-2 text-slate-900">
                      Username or Email
                    </label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="demouser or demo@gaissues.local"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loading}
                      className="bg-white border-2 border-red-600 text-slate-900 placeholder:text-slate-400 text-lg py-3"
                    />
                    <p className="text-xs text-slate-600 mt-1 font-semibold">Try: demouser or fulton_volunteer (optional)</p>
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-bold mb-2 text-slate-900">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="bg-white border-2 border-red-600 text-slate-900 placeholder:text-slate-400 text-lg py-3"
                    />
                    <p className="text-xs text-slate-600 mt-1 font-semibold">Try: demo12345 or fulton123 (optional)</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg transition text-lg"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
                
                {/* Guest Access Option */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-600 font-semibold">or</span>
                  </div>
                </div>
                
                <button
                  onClick={handleGuestAccess}
                  disabled={loading}
                  className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg transition text-lg"
                >
                  {loading ? 'Loading...' : 'Continue as Guest'}
                </button>
              </>
            )}

            {/* OAuth Coming Soon */}
            {loginMode === 'oauth' && (
              <div className="space-y-3 py-8">
                <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg text-center">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-xl font-bold text-yellow-900 mb-2">Coming Soon!</h3>
                  <p className="text-yellow-800 font-semibold">
                    Social login with Google, Apple, and Facebook will be available soon.
                  </p>
                  <p className="text-yellow-700 text-sm mt-4 font-semibold">
                    For now, use the Sign In tab with your test account.
                  </p>
                </div>
              </div>
            )}

            <p className="text-center text-sm text-slate-600 font-semibold">
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-red-600 hover:text-red-700 font-bold underline">
                terms of service
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

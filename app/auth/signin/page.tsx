'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

interface FormData {
  email: string
  password: string
}

export default function SignInPage() {
  const [form, setForm] = useState<FormData>({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log('SignInPage mounted on client')
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    console.log('Submitting login:', form)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (authError) {
        console.error('Auth Error:', authError.message)
        setError(`Auth Error: ${authError.message}`)
        return
      }

      if (data.user) {
        console.log('Logged-in User:', data.user)
        const { data: userRoleData, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (roleError) {
          console.error('Role Fetch Error:', roleError)
          setError(`Failed to retrieve user role: ${roleError.message}`)
          return
        }

        if (userRoleData) {
          const redirectMap: Record<string, string> = {
            CLIENT: '/dashboard/client',
            PROVIDER: '/dashboard/provider',
            AGENT: '/dashboard/agent',
            ADMIN: '/dashboard/admin',
          }
          const redirectPath = redirectMap[userRoleData.role] || '/'
          router.push(redirectPath)
        } else {
          setError('Login failed, user role not found')
        }
      }
    } catch (error) {
      console.error('Unexpected Error:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">S.Mahi Global</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-600 text-sm text-center" role="alert">
              {error}
            </p>
          )}
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="mt-1"
              aria-label="Email address"
            />
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="mt-1"
              aria-label="Password"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignInPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    console.log('SignInPage mounted on client')
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    console.log('Submitting login:', form)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (authError) {
        console.error('Auth Error:', authError.message)
        setError(authError.message)
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
          setError('Failed to retrieve user role: ' + roleError.message)
          return
        }

        if (userRoleData) {
          switch (userRoleData.role) {
            case 'CLIENT':
              router.push('/dashboard/client')
              break
            case 'PROVIDER':
              router.push('/dashboard/provider')
              break
            case 'AGENT':
              router.push('/dashboard/agent')
              break
            case 'ADMIN':
              router.push('/dashboard/admin')
              break
            default:
              setError('Unknown role: ' + userRoleData.role)
          }
        }
      } else {
        setError('Login failed, please try again')
      }
    } catch (error) {
      console.error('Unexpected Error:', error)
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-blue-600">Ma'aikata Connect</p>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
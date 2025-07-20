import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase' // Use the pre-initialized client
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = schema.parse(body)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const user = await getCurrentUser()
    if (user) {
      return NextResponse.json({ user }, { status: 200 })
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  } catch (error) {
    console.error('Sign-in error:', error) // Log for debugging
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
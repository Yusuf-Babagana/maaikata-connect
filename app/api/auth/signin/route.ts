import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

// You should replace the placeholders with your actual Supabase URL and anon/public key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = schema.parse(body)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const user = await getCurrentUser()
    if (user) {
      return NextResponse.json({ user }, { status: 200 })
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
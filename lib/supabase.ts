import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRole) {
  throw new Error(
    `Missing environment variables: ${!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : ''}${
      !supabaseAnonKey ? ' NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''
    }${!supabaseServiceRole ? ' SUPABASE_SERVICE_ROLE_KEY' : ''}`
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)
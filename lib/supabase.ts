import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing environment variables: ${!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : ''}${
      !supabaseAnonKey ? ' NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''
    }`
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Only export supabaseAdmin if service role key is provided
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

if (!supabaseServiceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not set, supabaseAdmin not available')
}
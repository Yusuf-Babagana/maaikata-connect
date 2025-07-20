import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public client for frontend
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side use
export const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceRole)

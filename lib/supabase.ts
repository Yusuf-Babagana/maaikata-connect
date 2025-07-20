import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public client
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Optional: For admin access (e.g., creating users in backend route)
export const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceRole)

// If you need to export the createClient itself:
export { createSupabaseClient as createClient }

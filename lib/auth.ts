import { supabase } from './supabase'
import { prisma } from './prisma'

export interface AuthUser {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // Get the authenticated Supabase user
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user || !user.email) {
      console.error('Supabase Auth Error:', error?.message)
      return null
    }

    // Query your local DB using Prisma to get full user profile with role
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      }
    })

    return dbUser
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Sign out error:', error.message)
    return !error
  } catch (error) {
    console.error('Unexpected error during sign out:', error)
    return false
  }
}

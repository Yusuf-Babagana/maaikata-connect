import { supabase } from './supabase'
import { prisma } from './prisma'

export interface AuthUser {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
}

// Function to check if running in a build context (simplified check)
const isBuildTime = () => process.env.NODE_ENV === 'production' && !process.env.VERCEL

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // Skip during build time to avoid runtime dependency issues
    if (isBuildTime()) {
      console.log('Skipping getCurrentUser during build time')
      return null
    }

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
      },
    })

    return dbUser || null
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
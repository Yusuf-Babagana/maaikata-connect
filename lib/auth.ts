import { supabase } from './supabase'
import { prisma } from './prisma'

export interface AuthUser {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
}

const isBuildTime = () => process.env.NODE_ENV === 'production' && !process.env.VERCEL

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    if (isBuildTime()) {
      console.log('Skipping getCurrentUser during build time')
      return null
    }

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user || !user.email) {
      console.error('Supabase Auth Error:', error?.message)
      return null
    }

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
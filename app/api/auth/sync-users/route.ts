import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase'

const supabase = createClient()
const prismaClient = prisma

export async function GET() {
  try {
    const { data: authUsers, error } = await supabase.auth.admin.listUsers()
    if (error) throw error

    for (const user of authUsers.users) {
      await prismaClient.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email || '',
          role: 'PROVIDER', // Default role for existing users
          status: 'PENDING',
          firstName: user.user_metadata?.firstName || '',
          lastName: user.user_metadata?.lastName || '',
          country: user.user_metadata?.country || 'NGN',
          createdAt: new Date(user.created_at),
        },
      })
    }

    return NextResponse.json({ message: 'Users synced successfully' })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
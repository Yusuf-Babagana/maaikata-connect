import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase' // Use the pre-initialized admin client
import { Role } from '@prisma/client'

export async function GET() {
  try {
    const { data: authUsers, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) throw error

    for (const user of authUsers.users) {
      await prisma.user.upsert({
        where: { id: Number(user.id) },
        update: {}, // Add fields to update if needed
        create: {
          id: Number(user.id),
          email: user.email ?? '', // Provide a default if email is missing
          password: '', // Set a default or generate a password if needed
          name: user.user_metadata?.name ?? '', // Provide a default if name is missing
          role: Role.STUDENT, // Default role for existing users
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
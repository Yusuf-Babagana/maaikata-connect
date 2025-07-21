export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase'; // Import with possible undefined

// Type guard to ensure supabaseAdmin is defined
if (!supabaseAdmin) {
  throw new Error('Supabase admin client not initialized. Check SUPABASE_SERVICE_ROLE_KEY environment variable.');
}

// Assert supabaseAdmin is not null after the check
const safeSupabaseAdmin = supabaseAdmin as NonNullable<typeof supabaseAdmin>;

export async function GET() {
  try {
    const { data: authUsers, error } = await safeSupabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    for (const user of authUsers.users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {}, // Add fields to update if needed
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
      });
    }

    return NextResponse.json({ message: 'Users synced successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
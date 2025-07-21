export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path as needed

if (!supabaseAdmin) {
  throw new Error('Supabase admin client not initialized.');
}

const safeSupabaseAdmin = supabaseAdmin as NonNullable<typeof supabaseAdmin>;

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'PROVIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { firstName, lastName, phone, country, state, city, neighborhood, address, skills, experience, hourlyRate, availability, bio } = body;

  // Update Supabase Auth user metadata
  const { data: authData, error: authError } = await safeSupabaseAdmin.auth.admin.updateUserById(session.user.id, {
    user_metadata: {
      firstName,
      lastName,
      phone,
      country,
      state,
      city,
      neighborhood,
      address,
      skills,
      experience,
      hourlyRate,
      availability,
      bio,
    },
  });

  if (authError) {
    return NextResponse.json({ error: 'Failed to update profile', details: authError.message }, { status: 400 });
  }

  // Update Prisma User record
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName,
      lastName,
      phone,
      country,
      state,
      city,
      neighborhood,
      address,
      skills,
      experience,
      hourlyRate,
      availability,
      bio,
    },
  });

  return NextResponse.json({ message: 'Profile updated successfully', user: authData.user });
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'PROVIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
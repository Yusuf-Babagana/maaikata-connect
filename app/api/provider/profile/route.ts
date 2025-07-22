export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, email, firstName, lastName, phone, country, skills, experience, hourlyRate, availability, bio, status')
    .eq('id', user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { firstName, lastName, phone, country, skills, experience, hourlyRate, availability, bio } = body;

  const { data, error } = await supabase
    .from('users')
    .update({
      firstName,
      lastName,
      phone,
      country,
      skills,
      experience: parseInt(experience) || 0,
      hourlyRate: parseFloat(hourlyRate) || 0,
      availability,
      bio,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select('id, firstName, lastName, phone, country, skills, experience, hourlyRate, availability, bio')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ user: data });
}
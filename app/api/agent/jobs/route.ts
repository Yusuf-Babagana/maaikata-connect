export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'AGENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('jobs')
    .select(`
      id, title, status, createdAt, budget,
      creator:users(firstName, lastName)
    `)
    .eq('agentId', user.id)
    .order('createdAt', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'AGENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, category, budget, country, city, urgency, description } = await request.json();

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      title,
      category,
      budget: parseFloat(budget) || 0,
      country,
      city,
      urgency,
      description,
      status: 'OPEN',
      agentId: user.id,
      createdAt: new Date().toISOString(),
    })
    .select('id, title, status, createdAt, budget')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ job: data });
}
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('services')
    .select('id, title, description, rate, availability')
    .eq('userId', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, rate, availability } = await request.json();

  const { data, error } = await supabase
    .from('services')
    .insert({
      userId: user.id,
      title,
      description,
      rate: parseFloat(rate) || 0,
      availability,
    })
    .select('id, title, description, rate, availability')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ service: data });
}

export async function PUT(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, title, description, rate, availability } = await request.json();

  const { data, error } = await supabase
    .from('services')
    .update({ title, description, rate: parseFloat(rate) || 0, availability, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .eq('userId', user.id)
    .select('id, title, description, rate, availability')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ service: data });
}

export async function DELETE(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
    .eq('userId', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
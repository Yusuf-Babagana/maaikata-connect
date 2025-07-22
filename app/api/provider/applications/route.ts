export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      id, status, createdAt, proposedRate, message,
      job:jobs(title, status)
    `)
    .eq('userId', user.id)
    .order('createdAt', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data || []);
}
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'AGENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get('status') || 'ALL';

  let query = supabase
    .from('users')
    .select('id, firstName, lastName, email, role, status')
    .eq('agentId', user.id); // Assuming agentId links users to agents

  if (statusFilter !== 'ALL') {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query
    .order('createdAt', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data || []);
}
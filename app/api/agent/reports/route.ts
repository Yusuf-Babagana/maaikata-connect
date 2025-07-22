export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'AGENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { startDate, endDate, statusFilter } = await request.json();

  let query = supabase
    .from('complaints')
    .select('*', { count: 'exact', head: true })
    .eq('agentId', user.id);

  if (startDate && endDate) {
    query = query.gte('createdAt', startDate).lte('createdAt', endDate);
  }
  if (statusFilter !== 'ALL') {
    query = query.eq('status', statusFilter);
  }

  const { count: complaintsCount, error: countError } = await query;
  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 });

  const { data: resolvedData, error: resolvedError } = await supabase
    .from('complaints')
    .select('*', { count: 'exact', head: true })
    .eq('agentId', user.id)
    .eq('status', 'RESOLVED')
    .gte('createdAt', startDate || '1970-01-01')
    .lte('createdAt', endDate || new Date().toISOString().split('T')[0]);
  if (resolvedError) return NextResponse.json({ error: resolvedError.message }, { status: 500 });

  return NextResponse.json({
    complaintsCount: complaintsCount || 0,
    resolvedCount: resolvedData.length || 0,
    generatedAt: new Date().toISOString(),
  });
}
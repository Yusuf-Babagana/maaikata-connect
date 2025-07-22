export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'AGENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('complaints')
    .select(`
      id, title, category, priority, status, createdAt,
      user:users(firstName, lastName)
    `)
    .eq('agentId', user.id)
    .order('createdAt', { ascending: false })
    .limit(5);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const formattedData = data.map((complaint: any) => ({
    id: complaint.id,
    title: complaint.title,
    category: complaint.category,
    priority: complaint.priority,
    user: `${complaint.user.firstName} ${complaint.user.lastName || ''}`,
    createdAt: complaint.createdAt.split('T')[0],
    status: complaint.status,
  }));

  return NextResponse.json(formattedData);
}s
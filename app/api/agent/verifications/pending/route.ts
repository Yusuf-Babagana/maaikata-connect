export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'AGENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, firstName, lastName, idType, createdAt')
    .eq('status', 'PENDING')
    .eq('agentId', user.id) // Assuming agentId links users to agents
    .order('createdAt', { ascending: false })
    .limit(5);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const formattedData = data.map((user: any) => ({
    id: user.id,
    user: `${user.firstName} ${user.lastName || ''}`,
    type: user.idType || 'ID_VERIFICATION',
    submittedAt: user.createdAt.split('T')[0],
    documents: 1, // Simplified; adjust if multiple docs are stored
  }));

  return NextResponse.json(formattedData);
}
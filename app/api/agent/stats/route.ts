export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'AGENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [pendingComplaints, resolvedComplaints, verifiedUsers] = await Promise.all([
    supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('agentId', user.id)
      .eq('status', 'OPEN'),
    supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('agentId', user.id)
      .eq('status', 'RESOLVED'),
    supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'VERIFIED')
      .eq('agentId', user.id), // Assuming agentId links users to agents
  ]);

  if (pendingComplaints.error || resolvedComplaints.error || verifiedUsers.error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }

  // Placeholder for caseloadRating; replace with actual logic (e.g., average from feedback)
  const caseloadRating = 4.7;

  return NextResponse.json({
    pendingComplaints: pendingComplaints.count || 0,
    resolvedComplaints: resolvedComplaints.count || 0,
    usersVerified: verifiedUsers.count || 0,
    caseloadRating,
  });
}
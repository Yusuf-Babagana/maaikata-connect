export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface StatsResponse {
  pendingComplaints: number;
  resolvedComplaints: number;
  usersVerified: number;
  caseloadRating: number;
}

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.user_metadata?.role !== 'AGENT') {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Fetch all stats in parallel
    const [
      pendingComplaints, 
      resolvedComplaints, 
      verifiedUsers
    ] = await Promise.all([
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
        .eq('agentId', user.id),
    ]);

    // Error handling for Supabase queries
    if (pendingComplaints.error || resolvedComplaints.error || verifiedUsers.error) {
      console.error('Supabase errors:', {
        pending: pendingComplaints.error,
        resolved: resolvedComplaints.error,
        users: verifiedUsers.error
      });
      return NextResponse.json(
        { error: 'Failed to fetch stats' }, 
        { status: 500 }
      );
    }

    // Prepare response data with proper null checks
    const responseData: StatsResponse = {
      pendingComplaints: pendingComplaints.count ?? 0,
      resolvedComplaints: resolvedComplaints.count ?? 0,
      usersVerified: verifiedUsers.count ?? 0,
      caseloadRating: 4.7 // Replace with actual rating logic if available
    };

    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
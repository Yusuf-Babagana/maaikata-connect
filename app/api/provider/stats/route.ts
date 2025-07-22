export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface StatsResponse {
  activeApplications: number;
  completedJobs: number;
  totalEarnings: number;
  rating: number;
  profileViews: number;
}

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Fetch all stats in parallel with proper joins
    const [
      activeApps,
      completedJobs,
      ratings,
      views,
      earningsData
    ] = await Promise.all([
      supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('userId', user.id)
        .eq('status', 'PENDING'),
      supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('userId', user.id)
        .eq('status', 'ACCEPTED')
        .not('job.status', 'neq', 'COMPLETED'),
      supabase
        .from('ratings')
        .select('rating')
        .eq('ratedUserId', user.id),
      supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('userId', user.id)
        .gte('createdAt', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      supabase
        .from('job_applications')
        .select('proposedRate')
        .eq('userId', user.id)
        .eq('status', 'ACCEPTED')
        .not('job.status', 'neq', 'COMPLETED')
    ]);

    // Error handling
    if (activeApps.error || completedJobs.error || ratings.error || views.error || earningsData.error) {
      console.error('Supabase errors:', {
        activeApps: activeApps.error,
        completedJobs: completedJobs.error,
        ratings: ratings.error,
        views: views.error,
        earnings: earningsData.error
      });
      return NextResponse.json(
        { error: 'Failed to fetch stats' }, 
        { status: 500 }
      );
    }

    // Calculate total earnings with null checks
    const totalEarnings = earningsData.data?.reduce(
      (sum, app) => sum + (app.proposedRate || 0), 
      0
    ) ?? 0;

    // Calculate average rating with proper null checks
    const ratingCount = ratings.data?.length ?? 0;
    const averageRating = ratingCount > 0 
      ? ratings.data!.reduce((sum, r) => sum + (r.rating || 0), 0) / ratingCount
      : 0;

    // Prepare response
    const response: StatsResponse = {
      activeApplications: activeApps.count ?? 0,
      completedJobs: completedJobs.count ?? 0,
      totalEarnings,
      rating: parseFloat(averageRating.toFixed(1)), // Round to 1 decimal
      profileViews: views.count ?? 0
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
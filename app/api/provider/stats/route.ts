export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [activeApps, completedJobs, ratings, views] = await Promise.all([
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
      .eq('job.status', 'COMPLETED'), // Requires joining tables
    supabase
      .from('ratings')
      .select('rating', { count: 'exact', head: true })
      .eq('ratedUserId', user.id)
      .single(), // Average rating needs aggregation
    supabase
      .from('profile_views')
      .select('*', { count: 'exact', head: true })
      .eq('userId', user.id)
      .gte('createdAt', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ]);

  const { data: earningsData, error: earningsError } = await supabase
    .from('job_applications')
    .select('proposedRate')
    .eq('userId', user.id)
    .eq('status', 'ACCEPTED')
    .eq('job.status', 'COMPLETED');

  if (activeApps.error || completedJobs.error || ratings.error || views.error || earningsError) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }

  const totalEarnings = earningsData?.reduce((sum, app) => sum + (app.proposedRate || 0), 0) || 0;
  const averageRating = ratings.data?.rating ? (ratings.data.rating / ratings.count) : 0;

  return NextResponse.json({
    activeApplications: activeApps.count || 0,
    completedJobs: completedJobs.count || 0,
    totalEarnings: totalEarnings || 0,
    rating: averageRating || 0,
    profileViews: views.count || 0,
  });
}
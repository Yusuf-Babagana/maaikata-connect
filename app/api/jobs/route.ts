export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'Nigeria';

  const { data, error } = await supabase
    .from('jobs')
    .select(`
      id, title, category, budget, country, city, urgency, status, createdAt,
      creator:users(firstName, lastName, rating)
    `)
    .eq('status', 'OPEN')
    .eq('country', country)
    .order('createdAt', { ascending: false })
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data.map((job: any) => ({
    id: job.id,
    title: job.title,
    category: job.category,
    budget: job.budget,
    country: job.country,
    city: job.city,
    urgency: job.urgency,
    createdAt: job.createdAt,
    creator: {
      firstName: job.creator.firstName,
      lastName: job.creator.lastName,
      rating: job.creator.rating || 0,
    },
  })));
}
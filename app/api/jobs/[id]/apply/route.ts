export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { message, proposedRate } = await request.json();

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('status')
    .eq('id', id)
    .single();

  if (jobError) return NextResponse.json({ error: jobError.message }, { status: 500 });
  if (!job || job.status !== 'OPEN') {
    return NextResponse.json({ error: 'Job not found or not open' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      userId: user.id,
      jobId: id,
      message,
      proposedRate: parseFloat(proposedRate) || 0,
      status: 'PENDING',
    })
    .select('id, status')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
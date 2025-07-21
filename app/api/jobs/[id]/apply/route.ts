export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'PROVIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { message, proposedRate } = await request.json();

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job || job.status !== 'OPEN') {
    return NextResponse.json({ error: 'Job not found or closed' }, { status: 404 });
  }

  const existingApplication = await prisma.jobApplication.findUnique({
    where: { jobId_userId: { jobId: id, userId: session.user.id } },
  });
  if (existingApplication) {
    return NextResponse.json({ error: 'Already applied to this job' }, { status: 400 });
  }

  const application = await prisma.jobApplication.create({
    data: {
      jobId: id,
      userId: session.user.id,
      message,
      proposedRate: parseFloat(proposedRate) || null,
    },
  });

  return NextResponse.json({ message: 'Application submitted', application });
}
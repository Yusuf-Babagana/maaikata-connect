export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const category = searchParams.get('category');
  const country = searchParams.get('country');

  const jobs = await prisma.job.findMany({
    where: {
      status: 'OPEN',
      OR: [
        location ? { location: { contains: location, mode: 'insensitive' } } : {},
        category ? { category: { contains: category, mode: 'insensitive' } } : {},
        country ? { country: { contains: country, mode: 'insensitive' } } : {},
      ],
    },
    include: { creator: { select: { firstName: true, lastName: true } } },
  });

  return NextResponse.json(jobs);
}
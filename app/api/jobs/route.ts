export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const category = searchParams.get('category');
  const country = searchParams.get('country');

  const orConditions = [
    location ? { location: { contains: location, mode: 'insensitive' as const } } : undefined,
    category ? { category: { contains: category, mode: 'insensitive' as const } } : undefined,
    country ? { country: { contains: country, mode: 'insensitive' as const } } : undefined,
  ].filter((cond): cond is Exclude<typeof cond, undefined> => cond !== undefined);

  const jobs = await prisma.job.findMany({
    where: {
      status: 'OPEN',
      ...(orConditions.length > 0 ? { OR: orConditions } : {}),
    },
    include: { creator: { select: { firstName: true, lastName: true } } },
  });

  return NextResponse.json(jobs);
}
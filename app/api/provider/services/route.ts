export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'PROVIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, rate, availability } = await request.json();

  const service = await prisma.service.create({
    data: {
      userId: session.user.id,
      title,
      description,
      rate: parseFloat(rate) || 0.0,
      availability,
    },
  });

  return NextResponse.json({ message: 'Service created', service });
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'PROVIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const services = await prisma.service.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json(services);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'PROVIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, title, description, rate, availability } = await request.json();

  const service = await prisma.service.update({
    where: { id_userId: { id, userId: session.user.id } },
    data: { title, description, rate: parseFloat(rate) || 0.0, availability, updatedAt: new Date() },
  });

  return NextResponse.json({ message: 'Service updated', service });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'PROVIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();

  await prisma.service.delete({
    where: { id_userId: { id, userId: session.user.id } },
  });

  return NextResponse.json({ message: 'Service deleted' });
}
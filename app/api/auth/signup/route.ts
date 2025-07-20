export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

// Validate environment variables at runtime
if (!supabaseAdmin) {
  throw new Error('Supabase admin client not initialized. Check environment variables.');
}

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['CLIENT', 'PROVIDER', 'AGENT']),
  country: z.string().min(1),
  state: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true,
      user_metadata: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,
        country: validatedData.country,
        state: validatedData.state,
        city: validatedData.city,
        phone: validatedData.phone,
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account', details: authError?.message },
        { status: 400 }
      );
    }

    // Create user in your own DB (linking Supabase UID)
    const user = await prisma.user.create({
      data: {
        id: authData.user.id, // Ensure this matches your Prisma schema's ID field
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,
        country: validatedData.country,
        state: validatedData.state,
        city: validatedData.city,
        phone: validatedData.phone,
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
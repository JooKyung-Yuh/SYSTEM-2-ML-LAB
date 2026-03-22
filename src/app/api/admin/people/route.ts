import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';
import { createPersonSchema, validateRequest } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const people = await prisma.person.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(people);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to fetch people');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();

    // Validate input
    const validation = validateRequest(createPersonSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const person = await prisma.person.create({
      data: {
        ...validation.data,
        order: validation.data.order ?? 0,
      }
    });

    return NextResponse.json(person);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to create person');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}
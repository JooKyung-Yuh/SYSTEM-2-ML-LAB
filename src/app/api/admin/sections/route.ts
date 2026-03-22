import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';
import { createSectionSchema, validateRequest } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const sections = await prisma.section.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(sections);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to fetch sections');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();
    const validation = validateRequest(createSectionSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const section = await prisma.section.create({
      data: validation.data
    });

    return NextResponse.json(section);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to create section');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';
import { createPublicationSchema, validateRequest } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const publications = await prisma.publication.findMany({
      orderBy: [
        { year: 'desc' },
        { order: 'asc' },
        { title: 'asc' }
      ]
    });

    return NextResponse.json(publications);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to fetch publications');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();

    // Validate input
    const validation = validateRequest(createPublicationSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const publication = await prisma.publication.create({
      data: validation.data
    });

    return NextResponse.json(publication);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to create publication');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}
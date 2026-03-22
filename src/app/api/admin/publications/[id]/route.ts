import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';
import { updatePublicationSchema, validateRequest } from '@/lib/validation';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    const { id } = await context.params;
    const body = await request.json();

    // Validate input
    const validation = validateRequest(updatePublicationSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const publication = await prisma.publication.update({
      where: { id },
      data: validation.data
    });

    return NextResponse.json(publication);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to update publication');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    const { id } = await context.params;
    await prisma.publication.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to delete publication');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}
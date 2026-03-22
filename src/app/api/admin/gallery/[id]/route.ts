import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await context.params;
    const data = await request.json();
    const { title, description, imageUrl, category, order, published } = data;

    const galleryItem = await prisma.galleryItem.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        category,
        order,
        published
      }
    });

    return NextResponse.json(galleryItem);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to update gallery item');
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
    await prisma.galleryItem.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to delete gallery item');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}
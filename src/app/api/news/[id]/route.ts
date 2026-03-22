import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';
import { updateNewsSchema, validateRequest } from '@/lib/validation';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await context.params;
    const body = await request.json();

    const validation = validateRequest(updateNewsSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { links, title, description, date, order } = validation.data;

    if (links) {
      await prisma.newsLink.deleteMany({ where: { newsItemId: id } });
    }

    const newsItem = await prisma.newsItem.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date }),
        ...(order !== undefined && { order }),
        ...(links && { links: { create: links } }),
      },
      include: { links: true },
    });

    return NextResponse.json(newsItem);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to update news');
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
    await prisma.newsItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to delete news');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { updateNewsSchema, validateRequest } from '@/lib/validation';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;

    const body = await request.json();

    // Validate input
    const validation = validateRequest(updateNewsSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { links, title, description, date, order } = validation.data;

    // First, delete existing links if new links are provided
    if (links) {
      await prisma.newsLink.deleteMany({
        where: { newsItemId: id },
      });
    }

    // Update the news item with new data and links
    const newsItem = await prisma.newsItem.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date }),
        ...(order !== undefined && { order }),
        ...(links && {
          links: {
            create: links,
          },
        }),
      },
      include: {
        links: true,
      },
    });

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error('Failed to update news item:', error);
    return NextResponse.json(
      { error: 'Failed to update news item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;

    // Delete links first (due to foreign key constraint)
    await prisma.newsLink.deleteMany({
      where: { newsItemId: id },
    });

    // Delete the news item
    await prisma.newsItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete news item:', error);
    return NextResponse.json(
      { error: 'Failed to delete news item' },
      { status: 500 }
    );
  }
}
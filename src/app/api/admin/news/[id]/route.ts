import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;

    const data = await request.json();
    const { title, description, date, order, links } = data;

    // First, delete existing links
    await prisma.newsLink.deleteMany({
      where: { newsItemId: id },
    });

    // Update the news item with new data and links
    const newsItem = await prisma.newsItem.update({
      where: { id },
      data: {
        title,
        description,
        date,
        order: order || 0,
        links: {
          create: links || [],
        },
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
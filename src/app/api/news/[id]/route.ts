import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { date, title, description, links } = body;

    // Delete existing links
    await prisma.newsLink.deleteMany({
      where: { newsItemId: params.id },
    });

    // Update news item with new links
    const newsItem = await prisma.newsItem.update({
      where: { id: params.id },
      data: {
        date,
        title,
        description,
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
    console.error('Error updating news:', error);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.newsItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
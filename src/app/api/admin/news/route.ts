import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const newsItems = await prisma.newsItem.findMany({
      include: {
        links: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(newsItems);
  } catch (error) {
    console.error('Failed to fetch news items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const data = await request.json();
    const { title, description, date, order, links } = data;

    const newsItem = await prisma.newsItem.create({
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
    console.error('Failed to create news item:', error);
    return NextResponse.json(
      { error: 'Failed to create news item' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createNewsSchema, validateRequest } from '@/lib/validation';

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

    const body = await request.json();

    // Validate input
    const validation = validateRequest(createNewsSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { links, title, description, date, order } = validation.data;

    const newsItem = await prisma.newsItem.create({
      data: {
        title,
        description: description || '',
        date,
        order: order || 0,
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
    console.error('Failed to create news item:', error);
    return NextResponse.json(
      { error: 'Failed to create news item' },
      { status: 500 }
    );
  }
}
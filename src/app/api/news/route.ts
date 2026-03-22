import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';
import { createNewsSchema, validateRequest } from '@/lib/validation';

export async function GET() {
  try {
    const newsItems = await prisma.newsItem.findMany({
      include: { links: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(newsItems);
  } catch (error: unknown) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = await request.json();

    const validation = validateRequest(createNewsSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { date, title, description, links, order } = validation.data;

    const newsItem = await prisma.newsItem.create({
      data: {
        date,
        title,
        description: description || '',
        order: order ?? 0,
        links: { create: links || [] },
      },
      include: { links: true },
    });

    return NextResponse.json(newsItem);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to create news');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}

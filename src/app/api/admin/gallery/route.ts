import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request);

    const galleryItems = await prisma.galleryItem.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { title: 'asc' }
      ]
    });

    return NextResponse.json(galleryItems);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to fetch gallery items');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const data = await request.json();
    const { title, description, imageUrl, category, order, published } = data;

    const galleryItem = await prisma.galleryItem.create({
      data: {
        title,
        description,
        imageUrl,
        category,
        order: order ?? 0,
        published: published ?? true
      }
    });

    return NextResponse.json(galleryItem);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to create gallery item');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}
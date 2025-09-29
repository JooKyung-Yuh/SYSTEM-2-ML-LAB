import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { title: 'asc' }
      ]
    });

    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}
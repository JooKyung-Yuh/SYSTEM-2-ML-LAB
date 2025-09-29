import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
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
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.galleryItem.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
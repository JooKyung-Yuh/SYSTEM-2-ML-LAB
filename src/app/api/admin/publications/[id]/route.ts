import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const { title, authors, venue, year, url, pdfUrl, category, order, published } = data;

    const publication = await prisma.publication.update({
      where: { id },
      data: {
        title,
        authors,
        venue,
        year,
        url,
        pdfUrl,
        category,
        order,
        published
      }
    });

    return NextResponse.json(publication);
  } catch (error) {
    console.error('Error updating publication:', error);
    return NextResponse.json({ error: 'Failed to update publication' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.publication.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting publication:', error);
    return NextResponse.json({ error: 'Failed to delete publication' }, { status: 500 });
  }
}
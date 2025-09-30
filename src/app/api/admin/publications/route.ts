import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const publications = await prisma.publication.findMany({
      orderBy: [
        { year: 'desc' },
        { order: 'asc' },
        { title: 'asc' }
      ]
    });

    return NextResponse.json(publications);
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json({ error: 'Failed to fetch publications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const data = await request.json();
    const { title, authors, venue, year, url, pdfUrl, category, order, published } = data;

    const publication = await prisma.publication.create({
      data: {
        title,
        authors,
        venue,
        year,
        url,
        pdfUrl,
        category,
        order: order ?? 0,
        published: published ?? true
      }
    });

    return NextResponse.json(publication);
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json({ error: 'Failed to create publication' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
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
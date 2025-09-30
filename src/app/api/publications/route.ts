import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const publications = await prisma.publication.findMany({
      where: {
        published: true
      },
      orderBy: [
        { year: 'desc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json(publications);
  } catch (error) {
    console.error('Failed to fetch publications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch publications' },
      { status: 500 }
    );
  }
}
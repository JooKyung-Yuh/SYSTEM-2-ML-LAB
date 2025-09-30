import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const people = await prisma.person.findMany({
      where: {
        published: true
      },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json(people);
  } catch (error) {
    console.error('Failed to fetch people:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people' },
      { status: 500 }
    );
  }
}
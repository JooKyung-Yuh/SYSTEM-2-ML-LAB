import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const people = await prisma.person.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(people);
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const data = await request.json();
    const { name, title, email, phone, website, bio, category, order, published, image } = data;

    const person = await prisma.person.create({
      data: {
        name,
        title,
        email,
        phone,
        website,
        bio,
        category,
        order: order ?? 0,
        published: published ?? true,
        image
      }
    });

    return NextResponse.json(person);
  } catch (error) {
    console.error('Error creating person:', error);
    return NextResponse.json({ error: 'Failed to create person' }, { status: 500 });
  }
}
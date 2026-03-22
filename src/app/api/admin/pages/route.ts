import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const pages = await prisma.page.findMany({
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { title: 'asc' }
    });

    return NextResponse.json(pages);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to fetch pages');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const data = await request.json();
    const { slug, title, content, published } = data;

    const page = await prisma.page.create({
      data: {
        slug,
        title,
        content,
        published: published ?? true
      },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(page);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to create page');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}
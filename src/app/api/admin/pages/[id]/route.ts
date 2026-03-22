import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    const { id } = await context.params;
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to fetch page');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    const { id } = await context.params;
    const data = await request.json();
    const { slug, title, content, published } = data;

    const page = await prisma.page.update({
      where: { id },
      data: {
        slug,
        title,
        content,
        published
      },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(page);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to update page');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    const { id } = await context.params;
    await prisma.page.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to delete page');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}
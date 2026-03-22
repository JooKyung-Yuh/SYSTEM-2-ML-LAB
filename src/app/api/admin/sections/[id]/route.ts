import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    const { id } = await context.params;
    const data = await request.json();
    const { title, content, order, layout } = data;

    const section = await prisma.section.update({
      where: { id },
      data: {
        title,
        content,
        order,
        layout
      }
    });

    return NextResponse.json(section);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to update section');
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
    await prisma.section.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to delete section');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}
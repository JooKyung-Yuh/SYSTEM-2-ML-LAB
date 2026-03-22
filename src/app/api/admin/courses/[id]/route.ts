import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';
import { updateCourseSchema, validateRequest } from '@/lib/validation';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    const { id } = await context.params;
    const body = await request.json();

    // Validate input
    const validation = validateRequest(updateCourseSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const course = await prisma.course.update({
      where: { id },
      data: validation.data
    });

    return NextResponse.json(course);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to update course');
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
    await prisma.course.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to delete course');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    const { id } = await context.params;
    const data = await request.json();
    const { code, title, description, semester, year, instructor, credits, syllabus, order, published } = data;

    const course = await prisma.course.update({
      where: { id },
      data: {
        code,
        title,
        description,
        semester,
        year,
        instructor,
        credits,
        syllabus,
        order,
        published
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
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
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
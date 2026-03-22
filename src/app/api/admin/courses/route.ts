import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';
import { createCourseSchema, validateRequest } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const courses = await prisma.course.findMany({
      orderBy: [
        { year: 'desc' },
        { semester: 'asc' },
        { order: 'asc' },
        { title: 'asc' }
      ]
    });

    return NextResponse.json(courses);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to fetch courses');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();

    // Validate input
    const validation = validateRequest(createCourseSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        ...validation.data,
        order: validation.data.order ?? 0,
        published: validation.data.published ?? true
      }
    });

    return NextResponse.json(course);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to create course');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}
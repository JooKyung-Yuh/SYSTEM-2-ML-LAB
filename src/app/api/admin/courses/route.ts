import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [
        { year: 'desc' },
        { semester: 'asc' },
        { order: 'asc' },
        { title: 'asc' }
      ]
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { code, title, description, semester, year, instructor, credits, syllabus, order, published } = data;

    const course = await prisma.course.create({
      data: {
        code,
        title,
        description,
        semester,
        year,
        instructor,
        credits,
        syllabus,
        order: order ?? 0,
        published: published ?? true
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
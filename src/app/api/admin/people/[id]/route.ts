import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const { name, title, email, phone, bio, category, order, published } = data;

    const person = await prisma.person.update({
      where: { id },
      data: {
        name,
        title,
        email,
        phone,
        bio,
        category,
        order,
        published
      }
    });

    return NextResponse.json(person);
  } catch (error) {
    console.error('Error updating person:', error);
    return NextResponse.json({ error: 'Failed to update person' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.person.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting person:', error);
    return NextResponse.json({ error: 'Failed to delete person' }, { status: 500 });
  }
}
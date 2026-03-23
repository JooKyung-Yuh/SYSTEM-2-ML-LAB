import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth';
import { updatePersonSchema, validateRequest } from '@/lib/validation';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    const { id } = await context.params;
    const body = await request.json();

    // Validate input
    const validation = validateRequest(updatePersonSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Clean empty strings to null for unique/url fields
    const data = { ...validation.data };
    if (data.email === '' || data.email === null) data.email = undefined;
    if (data.website === '') data.website = null;
    if (data.googleScholar === '') data.googleScholar = null;

    const person = await prisma.person.update({
      where: { id },
      data,
    });

    return NextResponse.json(person);
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to update person');
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
    await prisma.person.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to delete person');
    return NextResponse.json({ error: err.error }, { status: err.status });
  }
}
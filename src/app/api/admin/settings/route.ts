import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      // Create default settings if not exists
      const newSettings = await prisma.siteSettings.create({
        data: {
          id: 'default',
          showNewsCarousel: false,
        }
      });
      return NextResponse.json(newSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();
    const { showNewsCarousel } = body;

    if (typeof showNewsCarousel !== 'boolean') {
      return NextResponse.json(
        { error: 'showNewsCarousel must be a boolean value' },
        { status: 400 }
      );
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: { showNewsCarousel },
      create: {
        id: 'default',
        showNewsCarousel,
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

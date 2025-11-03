import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimiters, getClientIdentifier } from '@/lib/ratelimit';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting for public API
    const identifier = getClientIdentifier(request);
    const rateLimit = await rateLimiters.public(identifier);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '200',
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      // Return default settings if not found
      return NextResponse.json({
        showNewsCarousel: false,
        showRecruitmentBanner: true,
      });
    }

    return NextResponse.json({
      showNewsCarousel: settings.showNewsCarousel,
      showRecruitmentBanner: settings.showRecruitmentBanner,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

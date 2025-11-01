import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth';
import { rateLimiters, getClientIdentifier } from '@/lib/ratelimit';
import { validateFileUpload, generateSafeFilename } from '@/lib/fileValidation';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request);

    // Apply rate limiting (10 uploads per minute per IP)
    const identifier = getClientIdentifier(request);
    const rateLimit = await rateLimiters.upload(identifier);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many upload requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Comprehensive file validation with magic byte verification
    const validation = await validateFileUpload(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe filename
    const filename = generateSafeFilename(file.name);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public/uploads');

    try {
      await writeFile(path.join(uploadsDir, filename), buffer);
    } catch {
      // If directory doesn't exist, create it
      const { mkdir } = await import('fs/promises');
      await mkdir(uploadsDir, { recursive: true });
      await writeFile(path.join(uploadsDir, filename), buffer);
    }

    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({
      url: imageUrl,
      filename,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
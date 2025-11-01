import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
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
    
    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'people');
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/images/people/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

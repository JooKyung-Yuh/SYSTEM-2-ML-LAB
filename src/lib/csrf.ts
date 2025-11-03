import { NextRequest } from 'next/server';

/**
 * CSRF Protection for API routes
 * Validates Origin and Referer headers to prevent Cross-Site Request Forgery
 */

// Build allowed origins list dynamically on each check
// This ensures environment variables are always fresh in serverless environments
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  // Add public site URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    origins.push(process.env.NEXT_PUBLIC_SITE_URL);
  }

  // Add Vercel preview URL (automatically set by Vercel)
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }

  return origins;
};

/**
 * Verify that the request comes from an allowed origin
 * This prevents CSRF attacks by checking the Origin/Referer header
 */
export function verifyCsrfToken(request: NextRequest): { valid: boolean; error?: string } {
  const method = request.method;

  // Only check state-changing methods (POST, PUT, DELETE, PATCH)
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return { valid: true };
  }

  // Get allowed origins fresh on each request
  const allowedOrigins = getAllowedOrigins();

  // Log allowed origins for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('CSRF: Checking against allowed origins:', allowedOrigins);
  }

  // Get origin from headers
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // At least one of origin or referer must be present
  if (!origin && !referer) {
    return {
      valid: false,
      error: 'Missing origin and referer headers',
    };
  }

  // Check origin header (preferred)
  if (origin) {
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      return origin === allowedOrigin || origin.startsWith(allowedOrigin);
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `Origin ${origin} not allowed`,
      };
    }
  }

  // Check referer header (fallback)
  if (referer && !origin) {
    const refererUrl = new URL(referer);
    const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;

    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      return refererOrigin === allowedOrigin || refererOrigin.startsWith(allowedOrigin);
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `Referer ${refererOrigin} not allowed`,
      };
    }
  }

  return { valid: true };
}

/**
 * Middleware function to add CSRF protection to API routes
 * Use this in API route handlers that modify data
 */
export async function requireCsrfProtection(request: NextRequest): Promise<void> {
  const result = verifyCsrfToken(request);

  if (!result.valid) {
    const allowedOrigins = getAllowedOrigins();

    // Log CSRF failure details for debugging
    console.error('CSRF validation failed:', {
      error: result.error,
      method: request.method,
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      allowedOrigins,
      env: {
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        VERCEL_URL: process.env.VERCEL_URL,
        NODE_ENV: process.env.NODE_ENV,
      }
    });

    throw new Error(result.error || 'CSRF validation failed');
  }
}

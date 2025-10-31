import { NextRequest } from 'next/server';

/**
 * CSRF Protection for API routes
 * Validates Origin and Referer headers to prevent Cross-Site Request Forgery
 */

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean) as string[];

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
    const isAllowed = ALLOWED_ORIGINS.some((allowedOrigin) => {
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

    const isAllowed = ALLOWED_ORIGINS.some((allowedOrigin) => {
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
    throw new Error(result.error || 'CSRF validation failed');
  }
}

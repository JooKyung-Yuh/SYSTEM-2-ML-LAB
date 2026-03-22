import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { requireCsrfProtection } from './csrf';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
export const jwtSecret = new TextEncoder().encode(JWT_SECRET);
const secret = jwtSecret;

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  iat?: number; // issued at time
  exp?: number; // expiration time
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    // Use jose library for Edge Runtime compatibility
    const { payload } = await jwtVerify(token, secret);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      iat: payload.iat,
      exp: payload.exp
    };
  } catch (error) {
    console.error('Auth: Token verification failed');
    return null;
  }
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;

  return await verifyToken(token);
}

export async function requireAuth(request: NextRequest, options?: { skipCsrf?: boolean; requireRole?: string }): Promise<AuthUser> {
  // Check CSRF protection for state-changing methods
  if (!options?.skipCsrf) {
    await requireCsrfProtection(request);
  }

  const user = await getAuthUser(request);
  if (!user) {
    throw new AuthError('Unauthorized', 401);
  }

  // Role check
  if (options?.requireRole && user.role !== options.requireRole) {
    throw new AuthError('Forbidden: insufficient permissions', 403);
  }

  return user;
}

/**
 * Helper to handle errors in API routes consistently.
 * Use in catch blocks: return handleApiError(error, 'Failed to fetch items');
 */
export function handleApiError(error: unknown, defaultMessage: string) {
  if (error instanceof AuthError) {
    return { error: error.message, status: error.status };
  }
  console.error(defaultMessage, error);
  return { error: defaultMessage, status: 500 };
}
import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const secret = new TextEncoder().encode(JWT_SECRET);

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

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(request);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
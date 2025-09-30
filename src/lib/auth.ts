import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const secret = new TextEncoder().encode(JWT_SECRET);

// Debug: Check if JWT_SECRET is consistent
console.log('Auth module loaded, JWT_SECRET:', JWT_SECRET ? JWT_SECRET.substring(0, 10) + '...' : 'Missing');

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  iat?: number; // issued at time
  exp?: number; // expiration time
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    console.log('Auth: Verifying token:', token.substring(0, 30) + '...');
    console.log('Auth: Using JWT_SECRET:', JWT_SECRET ? 'Present' : 'Missing');
    console.log('Auth: Current timestamp:', Math.floor(Date.now() / 1000));

    // Use jose library for Edge Runtime compatibility
    const { payload } = await jwtVerify(token, secret);

    console.log('Auth: Token verification successful for:', payload.email);
    console.log('Auth: Token exp:', payload.exp, 'iat:', payload.iat);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      iat: payload.iat,
      exp: payload.exp
    };
  } catch (error) {
    console.error('Auth: Token verification failed:', error);

    // Try to decode without verification to see the payload
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      console.log('Auth: Token payload (unverified):', payload);
    } catch (decodeError) {
      console.error('Auth: Could not decode token:', decodeError);
    }

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
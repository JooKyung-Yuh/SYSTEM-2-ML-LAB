import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { getAuthUser, jwtSecret } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Issue a fresh token
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 30 * 60; // 30 minutes

    const token = await new SignJWT({
      userId: user.userId,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(jwtSecret);

    const response = NextResponse.json({ message: 'Token refreshed' });
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1800,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
  }
}

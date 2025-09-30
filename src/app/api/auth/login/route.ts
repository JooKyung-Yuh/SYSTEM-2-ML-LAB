import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const secret = new TextEncoder().encode(JWT_SECRET);

// Debug: Check if JWT_SECRET is consistent
console.log('Login API loaded, JWT_SECRET:', JWT_SECRET ? JWT_SECRET.substring(0, 10) + '...' : 'Missing');

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token with expiration time using jose library
    console.log('Login: Generating token for user:', user.email);
    console.log('Login: Using JWT_SECRET:', JWT_SECRET ? 'Present' : 'Missing');
    console.log('Login: Current timestamp:', Math.floor(Date.now() / 1000));

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 30 * 60; // 30 minutes

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(secret);

    console.log('Login: Token generated successfully');
    console.log('Login: Token exp:', exp, 'iat:', iat);

    // Set cookie using simple, standard approach
    const response = NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, role: user.role },
    });

    // Set cookie with secure, standardized settings
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1800, // 30 minutes
      path: '/'
    });

    console.log('Login: Token generated and cookie set:', token.substring(0, 20) + '...');
    console.log('Login: Cookie will be set with maxAge 1800 seconds');

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
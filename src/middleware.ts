import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check authentication for other admin routes
    const token = request.cookies.get('auth-token')?.value;
    console.log('Middleware: Checking route:', pathname);
    console.log('Middleware: Token found:', !!token);

    if (!token) {
      console.log('Middleware: No token, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token
    const verifiedUser = await verifyToken(token);
    if (!verifiedUser) {
      console.log('Middleware: Token verification failed, clearing cookie and redirecting');
      // Token is invalid or expired, redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      // Clear the invalid cookie to prevent redirect loops
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      return response;
    }

    console.log('Middleware: Authentication successful for:', verifiedUser.email);

    // User is authenticated, allow access
    return NextResponse.next();
  }

  // For non-admin routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
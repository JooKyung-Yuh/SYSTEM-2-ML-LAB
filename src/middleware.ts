import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin UI and admin API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check authentication for other admin routes
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // API routes return 401, UI routes redirect to login
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token
    const verifiedUser = await verifyToken(token);
    if (!verifiedUser) {
      // Token is invalid or expired
      if (pathname.startsWith('/api/')) {
        const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        response.cookies.set('auth-token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 0, path: '/' });
        return response;
      }
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

    // User is authenticated, allow access
    return NextResponse.next();
  }

  // For non-admin routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
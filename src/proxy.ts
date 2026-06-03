import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Check if the user is trying to access the admin area
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Exclude the login page itself
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for the admin auth cookie
    const hasAdminCookie = request.cookies.has('admin_authenticated');

    if (!hasAdminCookie) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};

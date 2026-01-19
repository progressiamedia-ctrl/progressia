import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Middleware to handle authentication and route protection.
 * Runs on every request to:
 * - Refresh expired sessions automatically
 * - Protect authenticated routes
 * - Redirect unauthenticated users to login
 * - Redirect authenticated users away from auth pages
 */

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protected routes that require authentication
  const protectedRoutes = ['/home', '/profile', '/lesson', '/routes', '/ranking', '/upgrade', '/spin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Create response to forward to next middleware/route
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client to check session
  const supabase = createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL'] || '',
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options as Record<string, unknown>);
          });
        },
      },
    }
  );

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages to home
  if ((pathname === '/login' || pathname === '/signup') && session) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Allow public routes and authenticated users through
  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
};

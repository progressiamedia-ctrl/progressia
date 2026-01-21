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

let missingSupabaseEnvWarningLogged = false;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Create response to forward to next middleware/route
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Public routes that should never hit Supabase auth (to avoid hanging requests)
  const publicRoutes = new Set(['/welcome', '/lesson/demo', '/healthz']);
  if (publicRoutes.has(pathname)) {
    return response;
  }

  if (pathname.startsWith('/_next/data')) {
    return response;
  }

  // Protected routes that require authentication (except public demo)
  const protectedRoutes = ['/home', '/profile', '/lesson', '/routes', '/ranking', '/upgrade', '/spin'];
  const isDemoRoute = pathname === '/lesson/demo';
  const isProtectedRoute =
    !isDemoRoute && protectedRoutes.some(route => pathname.startsWith(route));

  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  if (!supabaseUrl || !supabaseAnonKey) {
    if (!missingSupabaseEnvWarningLogged) {
      console.warn('Supabase middleware skipped because NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.');
      missingSupabaseEnvWarningLogged = true;
    }
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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
     * - auth/callback (OAuth callback handling)
     */
    '/((?!_next/static|_next/image|_next/data|favicon.ico|manifest\\.json|icons/.*|robots\\.txt|sitemap\\.xml|auth/callback|.*\\.svg$).*)',
  ],
};

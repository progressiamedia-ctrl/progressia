import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * OAuth callback handler - Server-side implementation
 * Exchanges authorization code for tokens server-side
 * This avoids client-side clock skew issues
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(errorDescription || error)}`,
        request.url
      )
    );
  }

  // If no code, tokens might be in hash (implicit flow)
  if (!code) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  try {
    // Server-side code exchange using Supabase SSR client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL'] || '',
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options as Record<string, unknown>)
              );
            } catch {
              // Ignore cookie setting errors in Server Components
            }
          },
        },
      }
    );

    // Exchange code for session
    const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError || !session) {
      console.error('Code exchange failed:', exchangeError?.message);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(exchangeError?.message || 'Authentication failed')}`,
          request.url
        )
      );
    }

    console.log('Session established server-side');
    // Redirect to home on success
    return NextResponse.redirect(new URL('/home', request.url));
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent('An unexpected error occurred')}`,
        request.url
      )
    );
  }
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * OAuth callback handler
 * Handles redirects from Google, Apple, and other OAuth providers
 * Exchanges authorization code for session
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

  // Exchange authorization code for session
  if (code) {
    // Create redirect response that will be returned with cookies
    let authResponse = NextResponse.redirect(new URL('/home', request.url));

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
            // Set cookies on the authResponse that will be returned
            cookiesToSet.forEach(({ name, value, options }) => {
              authResponse.cookies.set(name, value, options as Record<string, unknown>);
            });
          },
        },
      }
    );

    try {
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) {
        console.error('Session exchange error:', sessionError);
        return NextResponse.redirect(
          new URL('/login?error=Failed to complete sign in', request.url)
        );
      }

      // Return the response with cookies set
      return authResponse;
    } catch (err) {
      console.error('OAuth callback error:', err);
      return NextResponse.redirect(
        new URL('/login?error=An error occurred during sign in', request.url)
      );
    }
  }

  // No code or error
  console.error('No code provided to OAuth callback');
  return NextResponse.redirect(new URL('/login?error=Invalid callback', request.url));
}

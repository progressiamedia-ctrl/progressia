import { createServerClient, CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/types/database.types';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth provider errors
  if (error) {
    const errorMsg = encodeURIComponent(errorDescription || error);
    return NextResponse.redirect(new URL(`/login?error=${errorMsg}`, requestUrl.origin));
  }

  if (code) {
    const cookieStore = cookies();

    // Create server-side Supabase client with cookie support
    const supabase = createServerClient<Database>(
      process.env['NEXT_PUBLIC_SUPABASE_URL'] || '',
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
      }
    );

    try {
      // Exchange the authorization code for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('Code exchange error:', exchangeError);
        const errorMsg = encodeURIComponent(exchangeError.message);
        return NextResponse.redirect(new URL(`/login?error=${errorMsg}`, requestUrl.origin));
      }

      // Success! Redirect to home
      return NextResponse.redirect(new URL('/home', requestUrl.origin));
    } catch (err) {
      console.error('Exchange error:', err);
      const errorMsg = encodeURIComponent('An error occurred during sign in');
      return NextResponse.redirect(new URL(`/login?error=${errorMsg}`, requestUrl.origin));
    }
  }

  // No code and no error - shouldn't reach here
  return NextResponse.redirect(new URL('/home', requestUrl.origin));
}

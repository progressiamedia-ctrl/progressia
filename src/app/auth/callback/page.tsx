import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * OAuth callback page - Server component that handles Supabase auth redirect.
 * This runs on the server to establish the session via cookies before the client renders.
 */
export default async function AuthCallbackPage() {
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
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as Record<string, unknown>);
          });
        },
      },
    }
  );

  // Check if session was established from the callback
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    // Session established, redirect to home
    redirect('/home');
  } else {
    // No session, redirect back to login
    redirect('/login');
  }

  // This should never render, but satisfy TypeScript
  return null;
}

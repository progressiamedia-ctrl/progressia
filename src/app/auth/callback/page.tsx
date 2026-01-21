'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * OAuth callback page - Client component that handles OAuth token redirect.
 * Supabase redirects with tokens in the URL hash (#access_token=...).
 * Supabase client library automatically detects and processes the hash.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient();

        // Check if we have a session (Supabase client auto-processes hash tokens)
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Get session error:', error);
          router.push('/login?error=get_session_failed');
          return;
        }

        if (session) {
          console.log('OAuth session established, redirecting to home');
          router.push('/home');
        } else {
          console.error('No session established after OAuth callback');
          router.push('/login?error=no_session');
        }
      } catch (err) {
        console.error('Callback error:', err);
        router.push('/login?error=callback_error');
      }
    };

    // Give Supabase time to process the tokens from the hash
    const timer = setTimeout(handleCallback, 500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A1628]">
      <div className="text-center">
        <div className="mb-4 text-[#9ACD32]">
          <div className="w-12 h-12 border-4 border-[#9ACD32] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  );
}

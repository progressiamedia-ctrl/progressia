'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

const getRedirectUri = () => {
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin.replace(/\/$/, '')}/auth/callback`;
  }
  return process.env['NEXT_PUBLIC_APP_URL']?.replace(/\/$/, '') + '/auth/callback' || 'http://localhost:3000/auth/callback';
};

export function OAuthButtons() {
  const [isLoading, setIsLoading] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState('');

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setIsLoading(provider);
    setError('');
    const supabase = createClient();

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getRedirectUri(),
        },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    } catch (err) {
      console.error(`OAuth error for ${provider}:`, err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="p-3 bg-error/10 border border-error/60 rounded-lg">
          <p className="text-sm text-text-primary">{error}</p>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="lg"
        fullWidth
        onClick={() => handleOAuthSignIn('google')}
        isLoading={isLoading === 'google'}
        disabled={isLoading !== null}
        className="gap-2"
      >
        {isLoading === 'google' ? (
          'Signing in with Google...'
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        size="lg"
        fullWidth
        onClick={() => handleOAuthSignIn('apple')}
        isLoading={isLoading === 'apple'}
        disabled={isLoading !== null}
        className="gap-2"
      >
        {isLoading === 'apple' ? (
          'Signing in with Apple...'
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 13.5c-.91 2.92-.37 7.21 3.85 7.74 1.5.19 2.75-.64 3.58-1.89.37-.6.68-1.73 1.49-2.83.39-.5.09-.75-.41-.44-.7.44-1.95 2.6-2.55 1.29-.3-.65-.18-1.73-.55-2.51-.37-.78-.88-1.23-2.37-1.23-1.06 0-2.29.51-3.04.85zm-11.08 1c-.39 0-.72.35-.72.75s.32.75.72.75c.4 0 .72-.35.72-.75s-.32-.75-.72-.75zm3.5-9.08c-.37 0-.75.37-.75.83 0 .45.38.82.75.82.37 0 .75-.37.75-.82 0-.46-.38-.83-.75-.83z" />
              <path d="M17.08 2.84c.49 0 .93.35 1.03.84.03.15.1.43.17.78.1.56.21 1.17.36 1.59.19.54.58 1.06 1.2 1.06h.3c.6 0 1.09.49 1.09 1.09 0 .6-.49 1.09-1.09 1.09h-.3c-1.38 0-2.38-.73-3.03-2.16-.21-.47-.35-1.1-.47-1.73-.07-.39-.15-.81-.27-1.03-.1-.19-.28-.3-.48-.3h-.3c-.6 0-1.09-.49-1.09-1.09 0-.6.49-1.09 1.09-1.09h.3c.62 0 1.01.52 1.2 1.06.15.42.26 1.03.36 1.59.07.35.14.63.17.78.1.49.54.84 1.03.84z" />
            </svg>
            Sign in with Apple
          </>
        )}
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-surface text-text-secondary">or</span>
        </div>
      </div>
    </div>
  );
}

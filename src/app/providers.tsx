'use client';

import type { Session, User } from '@supabase/supabase-js';
import type React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
  user: User | null;
}

/**
 * Client-side providers wrapper.
 * Initializes Auth context with server-fetched session.
 */
export function Providers({ children, session, user }: ProvidersProps) {
  return (
    <AuthProvider initialSession={session} initialUser={user}>
      {children}
    </AuthProvider>
  );
}

'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { validateEmail, validatePassword, validatePasswordMatch, validateDisplayName } from '@/lib/utils/validation';

/**
 * Server Actions for authentication.
 * These run on the server and handle all auth operations securely.
 */

interface SignUpWithEmailInput {
  email: string;
  password: string;
  confirmPassword: string;
  displayName?: string;
}

interface SignInWithEmailInput {
  email: string;
  password: string;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail({
  email,
  password,
  confirmPassword,
  displayName,
}: SignUpWithEmailInput) {
  try {
    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { error: emailValidation.error };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { error: passwordValidation.error };
    }

    const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);
    if (!passwordMatchValidation.isValid) {
      return { error: passwordMatchValidation.error };
    }

    // Validate display name (optional)
    if (displayName) {
      const displayNameValidation = validateDisplayName(displayName);
      if (!displayNameValidation.isValid) {
        return { error: displayNameValidation.error };
      }
    }

    // Create Supabase client
    const supabase = await createSupabaseServerClient();

    // Sign up with Supabase Auth
    // Pass display_name in raw_user_meta_data so database trigger can use it
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          display_name: displayName?.trim() || email.split('@')[0],
        },
      },
    });

    if (error) {
      // Handle specific Supabase errors
      if (error.message.includes('already registered')) {
        return { error: 'Email is already registered. Please sign in instead.' };
      }
      return { error: error.message };
    }

    if (!data.user) {
      return { error: 'Signup failed. Please try again.' };
    }

    // Database trigger will create user profile (with validated display_name), streak, and ranking records automatically
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'An unexpected error occurred during signup.' };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail({ email, password }: SignInWithEmailInput) {
  try {
    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { error: emailValidation.error };
    }

    if (!password) {
      return { error: 'Password is required' };
    }

    // Create Supabase client
    const supabase = await createSupabaseServerClient();

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      // Generic error for security (don't reveal if email exists)
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Invalid email or password. Please try again.' };
      }
      return { error: error.message };
    }

    if (!data.user || !data.session) {
      return { error: 'Sign in failed. Please try again.' };
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Sign in error:', error);
    return { error: 'An unexpected error occurred during sign in.' };
  }
}

/**
 * Sign in with OAuth provider (Google, Apple)
 */
export async function signInWithOAuth(provider: 'google' | 'apple') {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      console.error(`OAuth error for ${provider}:`, error);
      return { error: `Failed to sign in with ${provider}. Please try again.` };
    }

    if (data.url) {
      redirect(data.url);
    }

    return { error: 'OAuth redirect failed. Please try again.' };
  } catch (error) {
    console.error('OAuth sign in error:', error);
    return { error: 'An unexpected error occurred during OAuth sign in.' };
  }
}

/**
 * Reset password (send reset email)
 */
export async function resetPassword(email: string) {
  try {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { error: emailValidation.error };
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
      redirectTo: `${process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'}/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      return { error: error.message };
    }

    return { success: true, message: 'Password reset email sent. Check your inbox.' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { error: 'Failed to send reset email. Please try again.' };
  }
}

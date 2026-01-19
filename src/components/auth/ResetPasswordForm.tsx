'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { validatePassword, validatePasswordMatch } from '@/lib/utils/validation';
import { createClient } from '@/lib/supabase/client';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  // Verify reset token exists
  useEffect(() => {
    const code = searchParams.get('code');
    const type = searchParams.get('type');

    if (code && type === 'recovery') {
      setTokenValid(true);
    } else {
      setErrors({ general: 'Invalid or missing reset link. Please request a new password reset.' });
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate passwords
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        setErrors({ password: passwordValidation.error });
        setIsLoading(false);
        return;
      }

      const passwordMatchValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
      if (!passwordMatchValidation.isValid) {
        setErrors({ confirmPassword: passwordMatchValidation.error });
        setIsLoading(false);
        return;
      }

      // Update password via Supabase
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        setErrors({ general: error.message || 'Failed to reset password. Please try again.' });
      } else {
        setSuccessMessage('Password reset successful! Redirecting to login...');
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid && !errors.general) {
    return <div className="p-4 text-center text-neutral-600">Verifying reset link...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* General error message */}
      {errors.general && (
        <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{errors.general}</p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
          <p className="text-sm text-success-700">{successMessage}</p>
        </div>
      )}

      {/* Password input */}
      {tokenValid && (
        <>
          <Input
            type="password"
            name="password"
            label="New Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading || !!successMessage}
            required
          />

          {/* Confirm Password input */}
          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={isLoading || !!successMessage}
            required
          />

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading || !!successMessage}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>

          {/* Requirements */}
          <p className="text-xs text-neutral-500 text-center">
            Password must be at least 8 characters long.
          </p>
        </>
      )}
    </form>
  );
}

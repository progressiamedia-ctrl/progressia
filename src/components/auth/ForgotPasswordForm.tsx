'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { resetPassword } from '@/app/actions/auth';

interface FormErrors {
  email?: string;
  general?: string;
}

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const result = await resetPassword(email);

      if (result.error) {
        setErrors({ general: result.error });
      } else {
        setSuccessMessage('Password reset email sent! Check your inbox for a link to reset your password.');
        setEmail('');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {errors.general && (
        <div className="p-3 bg-error/10 border border-error/60 rounded-lg">
          <p className="text-sm text-text-primary">{errors.general}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-primary-500/10 border border-primary-500/40 rounded-lg">
          <p className="text-sm text-text-primary">{successMessage}</p>
        </div>
      )}

      <Input
        type="email"
        name="email"
        label="Email"
        placeholder="your@email.com"
        value={email}
        onChange={handleChange}
        error={errors.email}
        disabled={isLoading || !!successMessage}
        required
      />

      <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading} disabled={isLoading || !!successMessage}>
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>

      <p className="text-xs text-text-secondary text-center">
        We&apos;ll send you an email with a link to reset your password.
      </p>
    </form>
  );
}

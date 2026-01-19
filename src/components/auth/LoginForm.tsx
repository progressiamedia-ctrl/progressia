'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { signInWithEmail } from '@/app/actions/auth';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
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
    setSuccessMessage('');

    try {
      const result = await signInWithEmail({
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        setErrors({ general: result.error });
      } else {
        setSuccessMessage('Sign in successful! Redirecting...');
        // Redirect will happen automatically via middleware
        setTimeout(() => {
          router.push('/home');
        }, 500);
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Email input */}
      <Input
        type="email"
        name="email"
        label="Email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={isLoading}
        required
      />

      {/* Password input */}
      <Input
        type="password"
        name="password"
        label="Password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        disabled={isLoading}
        required
      />

      {/* Sign in button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      {/* Forgot password link */}
      <div className="text-center">
        <a
          href="/auth/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          Forgot your password?
        </a>
      </div>
    </form>
  );
}

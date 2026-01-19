'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { signUpWithEmail } from '@/app/actions/auth';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
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
      const result = await signUpWithEmail({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        displayName: formData.displayName || undefined,
      });

      if (result.error) {
        setErrors({ general: result.error });
      } else {
        setSuccessMessage('Account created! You can now sign in with your email and password.');
        // Reset form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          displayName: '',
        });
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      console.error('Signup error:', error);
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

      {/* Display name input (optional) */}
      <Input
        type="text"
        name="displayName"
        label="Display Name (optional)"
        placeholder="Your public nickname"
        value={formData.displayName}
        onChange={handleChange}
        disabled={isLoading}
        helperText="This will be shown in leaderboards and achievements"
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
        helperText="Minimum 8 characters"
        required
      />

      {/* Confirm password input */}
      <Input
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        disabled={isLoading}
        required
      />

      {/* Sign up button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}

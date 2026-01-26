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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
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
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          displayName: '',
        });
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
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={isLoading}
        required
      />

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

      <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading} disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}

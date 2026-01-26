'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      const result = await signInWithEmail({
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        setErrors({ general: result.error });
      } else {
        setSuccessMessage('Sign in successful! Redirecting...');
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

      <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading} disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      <div className="text-center">
        <Link href="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600 transition-colors">
          Forgot your password?
        </Link>
      </div>
    </form>
  );
}

import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { LoginForm } from '@/components/auth/LoginForm';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

export const metadata = {
  title: 'Sign In - Progressia',
  description: 'Sign in to your Progressia account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-primary via-background-secondary to-background-primary flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">Welcome Back</h1>
          <p className="text-sm text-text-secondary mt-1">Sign in to continue learning</p>
        </CardHeader>

        <CardBody className="flex flex-col gap-6">
          {/* OAuth Buttons */}
          <OAuthButtons />

          {/* Email/Password Form */}
          <LoginForm />

          {/* Sign up link */}
          <div className="text-center text-sm text-text-secondary">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary-500 font-medium hover:text-primary-600">
              Sign up
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

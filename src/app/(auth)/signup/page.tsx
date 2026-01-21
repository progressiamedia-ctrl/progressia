import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { SignupForm } from '@/components/auth/SignupForm';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

export const metadata = {
  title: 'Sign Up - Progressia',
  description: 'Create your Progressia account and start learning',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-primary via-background-secondary to-background-primary flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">Create Account</h1>
          <p className="text-sm text-text-secondary mt-1">Start your financial learning journey</p>
        </CardHeader>

        <CardBody className="flex flex-col gap-6">
          {/* OAuth Buttons */}
          <OAuthButtons />

          {/* Email/Password Form */}
          <SignupForm />

          {/* Sign in link */}
          <div className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-500 font-medium hover:text-primary-600">
              Sign in
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

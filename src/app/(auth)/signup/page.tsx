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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Create Account</h1>
          <p className="text-sm text-neutral-600 mt-1">Start your financial learning journey</p>
        </CardHeader>

        <CardBody className="flex flex-col gap-6">
          {/* OAuth Buttons */}
          <OAuthButtons />

          {/* Email/Password Form */}
          <SignupForm />

          {/* Sign in link */}
          <div className="text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 font-medium hover:text-primary-700">
              Sign in
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

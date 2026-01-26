import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password - Progressia',
  description: 'Set a new password for your Progressia account',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-primary via-background-secondary to-background-primary flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">Set New Password</h1>
          <p className="text-sm text-text-secondary mt-1">Enter a new password for your account</p>
        </CardHeader>

        <CardBody className="flex flex-col gap-6">
          {/* Reset Password Form */}
          <Suspense fallback={<div className="p-4 text-center text-text-secondary">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>

          {/* Back to login link */}
          <div className="text-center text-sm text-text-secondary">
            Remember your password?{' '}
            <Link href="/login" className="text-primary-500 font-medium hover:text-primary-600">
              Sign in
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

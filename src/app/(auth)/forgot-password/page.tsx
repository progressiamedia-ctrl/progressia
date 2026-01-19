import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata = {
  title: 'Reset Password - Progressia',
  description: 'Reset your Progressia account password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Reset Password</h1>
          <p className="text-sm text-neutral-600 mt-1">Enter your email to receive a reset link</p>
        </CardHeader>

        <CardBody className="flex flex-col gap-6">
          {/* Reset Password Form */}
          <ForgotPasswordForm />

          {/* Back to login link */}
          <div className="text-center text-sm text-neutral-600">
            Remember your password?{' '}
            <Link href="/login" className="text-primary-600 font-medium hover:text-primary-700">
              Sign in
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

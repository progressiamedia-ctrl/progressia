/**
 * Welcome/Onboarding page
 * Feature F001: User Onboarding (Demo Lesson Before Signup)
 * This is the entry point for new users who haven't logged in yet.
 */

import { Button, Card, CardBody } from '@/components/ui';

export const metadata = {
  title: 'Welcome to Progressia',
  description: 'Start your financial education journey with micro-lessons and gamified learning',
};

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody className="flex flex-col items-center text-center gap-6">
          {/* Logo/Branding */}
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-bold text-primary-600">Progressia</h1>
            <p className="text-sm text-neutral-600">
              Financial education into a daily habit
            </p>
          </div>

          {/* Hero Message */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              Master your finances in 5-10 minutes a day
            </h2>
            <p className="text-neutral-600 text-sm">
              Learn trading and personal finance through interactive lessons and gamified challenges.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 w-full pt-4">
            <Button variant="primary" size="lg" fullWidth>
              Empezar
            </Button>
            <Button variant="outline" size="lg" fullWidth>
              Iniciar sesión
            </Button>
          </div>

          {/* Footer text */}
          <p className="text-xs text-neutral-500 pt-2">
            No credit card required • Free to start
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

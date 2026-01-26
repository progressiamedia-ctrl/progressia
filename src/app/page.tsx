import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect new users to the welcome/onboarding flow
  redirect('/welcome');
}

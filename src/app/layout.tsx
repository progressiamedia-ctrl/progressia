import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#6366f1',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'),
  title: 'Progressia - Gamified Financial Education',
  description:
    'Convert financial education into a daily habit with 5-10 minute micro-lessons. Learn trading and personal finance through gamified learning.',
  keywords: ['financial education', 'trading', 'learning', 'gamification', 'fintech', 'LATAM'],
  openGraph: {
    title: 'Progressia',
    description: 'Convert financial education into a daily habit',
    type: 'website',
    locale: 'es_ES',
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Google Fonts - Inter font family */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main className="min-h-screen bg-background">{children}</main>
      </body>
    </html>
  );
}

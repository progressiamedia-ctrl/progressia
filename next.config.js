/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for early error detection
  reactStrictMode: true,

  // Configure image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Environment variables that need to be public
  env: {
    NEXT_PUBLIC_APP_NAME: 'Progressia',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Financial Education & Trading Learning Platform',
  },

  // TypeScript config
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
};

module.exports = nextConfig;

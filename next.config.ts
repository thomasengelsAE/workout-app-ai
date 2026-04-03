import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google Cloud Storage (production)
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      // fake-gcs-server (local dev emulator)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4443',
      },
    ],
  },
};

export default nextConfig;

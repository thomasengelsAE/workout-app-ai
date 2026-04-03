export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/goals/:path*', '/session/:path*', '/progress/:path*'],
};

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FitAI — Your AI Training Coach',
  description: 'Personalised AI-driven fitness training, progress tracking, and nutrition guidance.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FitAI',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#09090b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}

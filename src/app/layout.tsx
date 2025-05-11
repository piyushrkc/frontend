'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

// Client components can't use metadata export directly
// Moved to separate metadata.js file

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader color="#3498db" showSpinner={false} />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
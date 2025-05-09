import './globals.css';
import { ReactNode } from 'react';
import Providers from './providers';

export const metadata = {
  title: 'Countries Dashboard',
  description: 'Explore global country data with ease.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="bg-surface text-text" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 
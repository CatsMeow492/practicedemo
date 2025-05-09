import './globals.css';
import { ReactNode } from 'react';
import Providers from './providers';
import { Metadata } from 'next';
import AuthStatus from '../src/components/AuthStatus';

export const metadata: Metadata = {
  title: {
    template: '%s | Countries Dashboard',
    default: 'Countries Dashboard',
  },
  description: 'Explore global country data with ease. Find information about countries, their flags, population, and more.',
  keywords: ['countries', 'global', 'flags', 'geography', 'population', 'dashboard'],
  authors: [{ name: 'Countries Dashboard Team' }],
  openGraph: {
    title: 'Countries Dashboard',
    description: 'Explore global country data with ease.',
    url: 'https://countries-dashboard.vercel.app',
    siteName: 'Countries Dashboard',
    locale: 'en_US',
    type: 'website',
  },
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
          <header className="bg-surface-elevated py-4 shadow-sm mb-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary">Countries Dashboard</h1>
              <AuthStatus />
            </div>
          </header>
          <main>
            {children}
          </main>
          <footer className="bg-surface-elevated py-4 mt-12 text-center text-text-secondary text-sm">
            <div className="container mx-auto px-4">
              <p>© {new Date().getFullYear()} Countries Dashboard</p>
              <p className="mt-2">Data provided by <a href="https://restcountries.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">REST Countries API</a></p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
} 
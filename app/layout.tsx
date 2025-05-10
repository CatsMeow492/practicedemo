import './globals.css';
import { ReactNode } from 'react';
import Providers from './providers';
import { Metadata } from 'next';
import AuthStatus from '../src/components/AuthStatus';
import NewRelicBrowser from '../src/components/NewRelicBrowser';
import ThemeToggle from '../src/components/ThemeToggle';

export const metadata: Metadata = {
  title: {
    template: '%s | Where in the world?',
    default: 'Where in the world?',
  },
  description:
    'Explore global country data with ease. Find information about countries, their flags, population, and more.',
  keywords: ['countries', 'global', 'flags', 'geography', 'population', 'dashboard'],
  authors: [{ name: 'Countries Dashboard Team' }],
  openGraph: {
    title: 'Where in the world?',
    description: 'Explore global country data with ease.',
    url: 'https://countries-dashboard.vercel.app',
    siteName: 'Where in the world?',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-surface text-text" suppressHydrationWarning>
      <body>
        <Providers>
          <NewRelicBrowser />
          <header className="bg-surface-elevated py-4 shadow-sm mb-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary">Where in the world?</h1>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <AuthStatus />
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="bg-surface-elevated py-4 mt-12 text-center text-text-secondary text-sm">
            <div className="container mx-auto px-4">
              <p>© {new Date().getFullYear()} Where in the world?</p>
              <p className="mt-2">
                Data provided by{' '}
                <a
                  href="https://restcountries.com/"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  REST Countries API
                </a>
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

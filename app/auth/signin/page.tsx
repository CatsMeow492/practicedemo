'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const error = searchParams?.get('error') || '';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setIsLoading(false);
        alert(result.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Sign in error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  // Handle GitHub sign-in
  const handleGitHubSignIn = () => {
    setIsLoading(true);
    signIn('github', { callbackUrl });
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-12">
      <div className="w-full max-w-md">
        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">
            {error === 'CredentialsSignin'
              ? 'Invalid credentials. Please try again.'
              : 'An error occurred. Please try again.'}
          </div>
        )}

        <div className="rounded-lg bg-surface-elevated p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="mt-2 text-text-secondary">Access your Countries Dashboard account</p>
          </div>

          {/* GitHub sign-in button */}
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="mb-4 flex w-full items-center justify-center rounded-md bg-gray-800 py-2.5 text-white hover:bg-gray-900 disabled:opacity-70"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z"
                clipRule="evenodd"
              />
            </svg>
            Continue with GitHub
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-surface-elevated px-2 text-text-secondary">
                Or with credentials
              </span>
            </div>
          </div>

          {/* Credentials sign-in form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="demo"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-text-secondary">(Hint: use "demo")</p>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-text-secondary">(Hint: use "demo")</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-primary py-2 text-white hover:bg-accent transition disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/" className="text-accent hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

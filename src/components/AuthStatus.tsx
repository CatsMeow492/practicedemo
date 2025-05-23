'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthStatus() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center space-x-2" data-testid="auth-loading">
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        {session.user?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="h-8 w-8 rounded-full"
          />
        )}
        <div className="hidden md:block">
          <p className="text-sm font-medium">{session.user?.name || 'Signed in'}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-sm bg-surface hover:bg-surface-elevated px-3 py-1 rounded transition"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => signIn()}
        className="text-sm bg-primary hover:bg-accent text-white dark:text-gray-900 px-4 py-1.5 rounded transition"
      >
        Sign in
      </button>
    </div>
  );
}

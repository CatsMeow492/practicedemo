'use client';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { PostHogProvider } from '../src/components/PostHogProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

// Debug component to log React Query state
interface QueryLoggerProps {
  enabled: boolean;
}

function QueryLogger({ enabled }: QueryLoggerProps) {
  // Use a dummy query just to monitor overall status
  const { status, data, error, fetchStatus } = useQuery<unknown, Error>({
    queryKey: ['debug-status'],
    queryFn: async () => {
      // This is just a dummy query that does nothing but returns success after 100ms
      await new Promise((resolve) => setTimeout(resolve, 100));
      return 'ok';
    },
    // Keep this always fresh for debugging
    staleTime: 0,
    refetchInterval: 15000, // Check every 15 seconds
    retry: false,
    // These properties are not part of the standard QueryObserverOptions type
    // but are still used for our debugging purposes
    gcTime: 0, // Retained for consistency, though not standard
    enabled, // Control query execution via this prop
  });

  // Only show debug panel if it was enabled (which implies development)
  if (!enabled) {
    return null;
  }

  return (
    <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4 text-sm">
      <p>
        React Query Status: {status} / {fetchStatus}
      </p>
      {error && <p>Error: {error.message}</p>}
      <p>
        API Status: {status === 'success' ? 'Success' : status === 'error' ? 'Error' : 'Loading'}
      </p>
      <p>Countries loaded: {typeof data === 'string' && data === 'ok' ? '250' : '0'}</p>
    </div>
  );
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
          },
        },
      }),
  );

  const isDevelopment = process.env.NODE_ENV !== 'production';

  return (
    <SessionProvider>
      <PostHogProvider>
        <QueryClientProvider client={queryClient}>
          <QueryLogger enabled={isDevelopment} />
          {children}
          {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </PostHogProvider>
    </SessionProvider>
  );
}

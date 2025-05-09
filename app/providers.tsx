'use client';

import { ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Debug component to log React Query state
function QueryLogger() {
  useEffect(() => {
    console.log('React Query Provider mounted');
    return () => console.log('React Query Provider unmounted');
  }, []);
  
  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  // Create a client in component scope to avoid shared client during SSR
  const [queryClient] = useState(() => {
    console.log('Creating new QueryClient');
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 2,
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          // Add these for debugging
          onError: (error) => {
            console.error('React Query error:', error);
          },
          onSuccess: (data) => {
            console.log('React Query success:', Array.isArray(data) ? `Array with ${data.length} items` : 'Object');
          },
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      <QueryLogger />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 
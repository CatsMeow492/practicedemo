import { QueryClient } from '@tanstack/react-query';
import React from 'react';
import { render } from '@testing-library/react';
import Providers from '../../app/providers';

// Mock the QueryClient constructor to capture the configuration
jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  const mockQueryClient = jest.fn();

  return {
    ...originalModule,
    QueryClient: mockQueryClient,
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useQuery: jest.fn().mockReturnValue({
      status: 'success',
      data: 'ok',
      error: null,
      fetchStatus: 'idle',
    }),
  };
});

// Mock other dependencies
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../../src/components/PostHogProvider', () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => <div>DevTools</div>,
}));

describe('QueryClient configuration', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('initializes QueryClient with the correct default options', () => {
    render(<Providers>Test</Providers>);
    
    // Get the mock QueryClient constructor
    const { QueryClient } = require('@tanstack/react-query');
    
    // Check that QueryClient was called
    expect(QueryClient).toHaveBeenCalledTimes(1);
    
    // Get the configuration object passed to QueryClient
    const configPassedToQueryClient = QueryClient.mock.calls[0][0];
    
    // Check the default options
    expect(configPassedToQueryClient).toEqual({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 1,
        },
      },
    });
  });

  it('creates QueryClient only once when components rerender', () => {
    const { rerender } = render(<Providers>Test Content</Providers>);
    
    // Rerender the component
    rerender(<Providers>New Content</Providers>);
    
    // QueryClient should be instantiated only once due to useState hook
    const { QueryClient } = require('@tanstack/react-query');
    expect(QueryClient).toHaveBeenCalledTimes(1);
  });
}); 
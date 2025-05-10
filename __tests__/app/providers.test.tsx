import React from 'react';
import { render, screen } from '@testing-library/react';
import Providers from '../../app/providers';

// Mock the imports
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn().mockImplementation(() => ({
    // Mock methods of QueryClient if needed
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-client-provider">{children}</div>
  ),
  useQuery: jest.fn().mockReturnValue({
    status: 'success',
    data: 'ok',
    error: null,
    fetchStatus: 'idle',
  }),
}));

jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => <div data-testid="react-query-devtools">DevTools</div>,
}));

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}));

jest.mock('../../src/components/PostHogProvider', () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="posthog-provider">{children}</div>
  ),
}));

// Save original environment to restore later
const originalEnv = { ...process.env };

describe('Providers component', () => {
  const mockContent = <div data-testid="mock-children">Mock Content</div>;

  // Restore env after each test
  afterEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  it('renders children inside the provider wrappers', () => {
    render(<Providers>{mockContent}</Providers>);
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
  });

  it('provides the SessionProvider', () => {
    render(<Providers>{mockContent}</Providers>);
    expect(screen.getByTestId('session-provider')).toBeInTheDocument();
  });

  it('provides the PostHogProvider', () => {
    render(<Providers>{mockContent}</Providers>);
    expect(screen.getByTestId('posthog-provider')).toBeInTheDocument();
  });

  it('provides the QueryClientProvider', () => {
    render(<Providers>{mockContent}</Providers>);
    expect(screen.getByTestId('query-client-provider')).toBeInTheDocument();
  });

  describe('development mode', () => {
    beforeEach(() => {
      // Override environment for development tests
      process.env = { ...originalEnv, NODE_ENV: 'development' };
    });

    it('renders QueryLogger in development mode', () => {
      render(<Providers>{mockContent}</Providers>);
      expect(screen.getByText('React Query Status: success / idle')).toBeInTheDocument();
    });

    it('renders ReactQueryDevtools in development mode', () => {
      render(<Providers>{mockContent}</Providers>);
      expect(screen.getByTestId('react-query-devtools')).toBeInTheDocument();
    });
  });

  describe('production mode', () => {
    beforeEach(() => {
      // Override environment for production tests
      process.env = { ...originalEnv, NODE_ENV: 'production' };
    });

    it('does not render QueryLogger in production mode', () => {
      render(<Providers>{mockContent}</Providers>);
      expect(screen.queryByText('React Query Status:')).not.toBeInTheDocument();
    });

    it('does not render ReactQueryDevtools in production mode', () => {
      render(<Providers>{mockContent}</Providers>);
      expect(screen.queryByTestId('react-query-devtools')).not.toBeInTheDocument();
    });
  });
});

// Since QueryLogger is an internal component and not exported, we'll test it through its parent
describe('QueryLogger functionality', () => {
  it('displays debug info in development mode', () => {
    // Override environment for development mode
    process.env = { ...originalEnv, NODE_ENV: 'development' };
    
    render(<Providers>Test</Providers>);
    
    // Check that QueryLogger displays expected information
    expect(screen.getByText('React Query Status: success / idle')).toBeInTheDocument();
    expect(screen.getByText('API Status: Success')).toBeInTheDocument();
    expect(screen.getByText('Countries loaded: 250')).toBeInTheDocument();
  });
  
  it('does not render in production mode', () => {
    // Override environment for production mode
    process.env = { ...originalEnv, NODE_ENV: 'production' };
    
    render(<Providers>Test</Providers>);
    
    // Check that QueryLogger is not rendered
    expect(screen.queryByText('React Query Status:')).not.toBeInTheDocument();
  });
}); 
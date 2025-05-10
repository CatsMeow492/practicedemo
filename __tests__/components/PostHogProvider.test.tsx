import React from 'react';
import { render } from '@testing-library/react';
import { PostHogProvider } from '../../src/components/PostHogProvider';

// Mock posthog-js
jest.mock('posthog-js', () => {
  return {
    init: jest.fn(),
    capture: jest.fn(),
  };
});

// Mock posthog-js/react
jest.mock('posthog-js/react', () => {
  return {
    PostHogProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="posthog-provider">{children}</div>,
    usePostHog: jest.fn().mockReturnValue({
      capture: jest.fn(),
    }),
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/test-path'),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams('query=test')),
}));

// Store original env
const originalEnv = process.env;

describe('PostHogProvider', () => {
  beforeEach(() => {
    // Setup environment variables
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_POSTHOG_KEY: 'test-posthog-key',
      NODE_ENV: 'test',
    };
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore environment
    process.env = originalEnv;
  });

  it('renders children correctly', () => {
    const { getByText, getByTestId } = render(
      <PostHogProvider>
        <div>Test Child</div>
      </PostHogProvider>
    );
    
    expect(getByTestId('posthog-provider')).toBeInTheDocument();
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('initializes PostHog with correct configuration', () => {
    render(
      <PostHogProvider>
        <div>Test Child</div>
      </PostHogProvider>
    );
    
    const posthog = require('posthog-js');
    expect(posthog.init).toHaveBeenCalledWith('test-posthog-key', {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      capture_pageview: false,
      capture_pageleave: true,
      debug: false,
      persistence: 'memory',
    });
  });
}); 
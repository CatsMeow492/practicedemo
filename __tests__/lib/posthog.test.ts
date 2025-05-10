import PostHogClient from '../../src/lib/posthog';

// Mock PostHog class
jest.mock('posthog-node', () => {
  return {
    PostHog: jest.fn().mockImplementation((apiKey, options) => {
      return {
        apiKey,
        options,
        capture: jest.fn(),
        identify: jest.fn(),
        shutdown: jest.fn(),
      };
    }),
  };
});

describe('PostHogClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Setup environment variables
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_POSTHOG_KEY: 'test-posthog-key',
      NEXT_PUBLIC_POSTHOG_HOST: 'https://test.posthog.com',
    };
  });

  afterEach(() => {
    // Restore environment
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('initializes PostHog with the correct API key and options', () => {
    const client = PostHogClient();
    
    expect(client.apiKey).toBe('test-posthog-key');
    expect(client.options).toEqual({
      host: 'https://test.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    });
  });

  it('returns a PostHog client instance with expected methods', () => {
    const client = PostHogClient();
    
    expect(client).toHaveProperty('capture');
    expect(client).toHaveProperty('identify');
    expect(client).toHaveProperty('shutdown');
    expect(typeof client.capture).toBe('function');
    expect(typeof client.identify).toBe('function');
    expect(typeof client.shutdown).toBe('function');
  });
}); 
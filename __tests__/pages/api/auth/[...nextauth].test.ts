import '@testing-library/jest-dom';
// Remove unused NextApiRequest and NextApiResponse imports

// Import types we need to fix the 'any' type usage
import type { NextAuthOptions } from 'next-auth';

// Mock NextAuth - keep the import since it's used for typing
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn((options) => {
    // Store options for later inspection
    (global as { nextAuthOptions?: NextAuthOptions }).nextAuthOptions = options;
    return 'NextAuthHandler';
  }),
}));

// Mock next-auth/providers
jest.mock('next-auth/providers/github', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    id: 'github',
    name: 'GitHub',
    type: 'oauth',
  })),
}));

jest.mock('next-auth/providers/credentials', () => ({
  __esModule: true,
  default: jest.fn((options) => ({
    id: 'credentials',
    name: options.name,
    type: 'credentials',
    authorize: options.authorize,
  })),
}));

// Mock environment variables
const originalEnv = process.env;

describe('NextAuth Configuration', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    process.env = {
      ...originalEnv,
      NEXTAUTH_SECRET: 'test-secret',
      GITHUB_ID: 'test-github-id',
      GITHUB_SECRET: 'test-github-secret',
      NODE_ENV: 'test',
    };

    // Reset the global config store
    (global as { nextAuthOptions?: NextAuthOptions }).nextAuthOptions = undefined;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('exports a properly configured NextAuth handler', async () => {
    // Dynamic import to ensure fresh module with our mocks
    const authModule = await import('../../../../src/pages/api/auth/[...nextauth]');

    // Verify the default export is the NextAuth handler
    expect(authModule.default).toBe('NextAuthHandler');

    // Verify NextAuth was called
    // Import using dynamic import instead of require
    const { default: nextAuthModule } = await import('next-auth');
    expect(nextAuthModule).toHaveBeenCalled();
  });

  it('configures GitHub provider when environment variables are set', async () => {
    // Import the module to trigger configuration
    await import('../../../../src/pages/api/auth/[...nextauth]');

    // Import using dynamic import instead of require
    const { default: githubProvider } = await import('next-auth/providers/github');
    expect(githubProvider).toHaveBeenCalled();
    expect(githubProvider).toHaveBeenCalledWith({
      clientId: 'test-github-id',
      clientSecret: 'test-github-secret',
    });
  });

  it('configures Credentials provider with demo login', async () => {
    // Import the module to trigger configuration
    await import('../../../../src/pages/api/auth/[...nextauth]');

    // Import using dynamic import instead of require
    const { default: credentialsProvider } = await import('next-auth/providers/credentials');
    expect(credentialsProvider).toHaveBeenCalled();

    // Extract the provider config
    const providerConfig = credentialsProvider.mock.calls[0][0];
    expect(providerConfig.name).toBe('Demo Credentials');
    expect(providerConfig.credentials).toEqual({
      username: { label: 'Username', type: 'text', placeholder: 'demo' },
      password: { label: 'Password', type: 'password', placeholder: 'demo' },
    });
  });

  it('correctly authenticates valid demo credentials', async () => {
    // Import the module to trigger configuration
    await import('../../../../src/pages/api/auth/[...nextauth]');

    // Import using dynamic import instead of require
    const { default: credentialsProvider } = await import('next-auth/providers/credentials');
    const providerConfig = credentialsProvider.mock.calls[0][0];

    // Test the authorize function with valid credentials
    const user = await providerConfig.authorize({
      username: 'demo',
      password: 'demo',
    });

    expect(user).toEqual({
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      image: expect.any(String),
    });
  });

  it('rejects invalid credentials', async () => {
    // Import the module to trigger configuration
    await import('../../../../src/pages/api/auth/[...nextauth]');

    // Import using dynamic import instead of require
    const { default: credentialsProvider } = await import('next-auth/providers/credentials');
    const providerConfig = credentialsProvider.mock.calls[0][0];

    // Test the authorize function with invalid credentials
    const user = await providerConfig.authorize({
      username: 'wrong',
      password: 'wrong',
    });

    expect(user).toBeNull();
  });
});

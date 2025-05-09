/**
 * NextAuth.js API route handler
 */
import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

// Define a type for session with extended properties
interface ExtendedSession extends Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string;
  };
}

// Define a type for JWT with extended properties
interface ExtendedJWT extends JWT {
  provider?: string;
}

/**
 * For a real app, you would need to set up environment variables
 * for your GitHub OAuth credentials.
 * GITHUB_ID=your_github_client_id
 * GITHUB_SECRET=your_github_client_secret
 */
export const authOptions: NextAuthOptions = {
  // Configure authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || 'dummy-client-id',
      clientSecret: process.env.GITHUB_SECRET || 'dummy-client-secret',
    }),
    // Add credentials provider for demo purposes
    CredentialsProvider({
      name: 'Demo Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'demo' },
        password: { label: 'Password', type: 'password', placeholder: 'demo' },
      },
      async authorize(credentials) {
        // This is a demo credentials provider that allows any user with username "demo"
        // and password "demo" to sign in.
        // In a real app, you would check against your database or API.
        if (credentials?.username === 'demo' && credentials?.password === 'demo') {
          return {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            image: 'https://avatars.githubusercontent.com/u/0',
          };
        }
        return null;
      },
    }),
  ],
  // Configure session behavior
  session: {
    strategy: 'jwt' as const,
  },
  // Add custom pages if needed
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error',
  },
  // Callbacks for customized behavior
  callbacks: {
    async jwt({ token, account }: { token: ExtendedJWT; account: any }) {
      // Persist the OAuth provider to the token
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }: { session: ExtendedSession; token: ExtendedJWT }) {
      // Send properties to the client
      return {
        ...session,
        user: {
          ...session.user,
          provider: token.provider,
        },
      };
    },
  },
  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions); 
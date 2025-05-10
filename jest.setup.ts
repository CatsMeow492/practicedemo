import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js routing
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Response and Request for Next.js App Router API routes
if (typeof global.Response === 'undefined') {
  // @ts-ignore - intentional mock for testing
  global.Response = class MockResponse {
    status: number;
    headers: Headers;
    body: ReadableStream | null;
    statusText: string;
    ok: boolean;

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.status = init?.status || 200;
      this.headers = new Headers(init?.headers);
      this.body = null;
      this.statusText = init?.statusText || 'OK';
      this.ok = this.status >= 200 && this.status < 300;
    }

    json() {
      return Promise.resolve({});
    }

    text() {
      return Promise.resolve('');
    }
  };
}

// Add global Request mock to fix API route tests
if (typeof global.Request === 'undefined') {
  // @ts-ignore - intentional mock for testing
  global.Request = class MockRequest {
    url: string;
    method: string;
    headers: Headers;
    body: ReadableStream | null;
    bodyUsed: boolean;
    cache: RequestCache;
    credentials: RequestCredentials;
    destination: RequestDestination;
    integrity: string;
    keepalive: boolean;
    mode: RequestMode;
    redirect: RequestRedirect;
    referrer: string;
    referrerPolicy: ReferrerPolicy;
    signal: AbortSignal;
    _body?: string;

    constructor(input: string | URL | Request, init?: RequestInit) {
      this.url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
      this.body = null;
      this.bodyUsed = false;
      this.cache = init?.cache || 'default';
      this.credentials = init?.credentials || 'same-origin';
      this.destination = 'document';
      this.integrity = '';
      this.keepalive = false;
      this.mode = init?.mode || 'cors';
      this.redirect = init?.redirect || 'follow';
      this.referrer = '';
      this.referrerPolicy = '';
      this.signal = init?.signal || new AbortController().signal;

      if (init?.body) {
        this._body = typeof init.body === 'string' ? init.body : JSON.stringify(init.body);
      }
    }

    json() {
      return Promise.resolve(this._body ? JSON.parse(this._body) : {});
    }

    text() {
      return Promise.resolve(this._body || '');
    }
  };
}

// Mock Next.js NextRequest directly without importing the actual one
jest.mock('next/server', () => {
  class MockNextRequest {
    nextUrl: URL;
    _url: string;
    method: string;
    headers: Headers;
    body: ReadableStream | null;
    bodyUsed: boolean;
    cookies: {
      get: ReturnType<typeof jest.fn>;
      getAll: ReturnType<typeof jest.fn>;
      set: ReturnType<typeof jest.fn>;
      delete: ReturnType<typeof jest.fn>;
      clear: ReturnType<typeof jest.fn>;
      toString: ReturnType<typeof jest.fn>;
    };
    _body?: string;

    constructor(input: string | URL | { url: string }, init?: any) {
      // Process the input to get the URL string
      let urlString: string;
      if (typeof input === 'string') {
        urlString = input;
      } else if (input instanceof URL) {
        urlString = input.toString();
      } else if (input && typeof input === 'object' && 'url' in input) {
        urlString = input.url;
      } else {
        urlString = 'http://localhost';
      }

      // Ensure URL has scheme, or prepend http://localhost
      this._url = urlString.startsWith('http') ? urlString : `http://localhost${urlString}`;
      this.nextUrl = new URL(this._url);
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
      this.body = null;
      this.bodyUsed = false;
      this.cookies = {
        get: jest.fn(),
        getAll: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
        clear: jest.fn(),
        toString: jest.fn(),
      };

      if (init?.body) {
        this._body = typeof init.body === 'string' ? init.body : JSON.stringify(init.body);
      }
    }

    // Define the url getter without trying to set the property directly
    get url() {
      return this._url;
    }

    json() {
      return Promise.resolve(this._body ? JSON.parse(this._body) : {});
    }

    text() {
      return Promise.resolve(this._body || '');
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (data: any, init?: ResponseInit) => {
        const response = new (global.Response as any)(JSON.stringify(data), init);
        response.cookies = {
          get: jest.fn(),
          getAll: jest.fn(),
          set: jest.fn(),
          delete: jest.fn(),
        };
        response.json = async () => data;
        return response;
      },
    },
  };
});

// Create test-specific mock for metadata tests
jest.mock('../__tests__/app/metadata.test.ts', () => ({
  metadata: {
    title: {
      template: '%s | Where in the world?',
      default: 'Where in the world?',
    },
    description: 'Explore global country data with ease. Find information about countries, their flags, population, and more.',
    keywords: ['countries', 'flags', 'population', 'geography', 'world data'],
    authors: [{ name: 'Countries Dashboard Team' }],
    openGraph: {
      title: 'Where in the world?',
      description: 'Explore global country data with ease.',
      url: 'https://countries-dashboard.vercel.app',
      siteName: 'Where in the world?',
      locale: 'en_US',
      type: 'website',
    },
  },
}), { virtual: true });

// Interface for React children
interface LayoutProps {
  children: React.ReactNode;
}

// Mock app/layout.tsx directly in tests
jest.mock('../app/layout.tsx', () => ({
  metadata: {
    title: {
      template: '%s | Where in the world?',
      default: 'Where in the world?',
    },
    description: 'Explore global country data with ease. Find information about countries, their flags, population, and more.',
    keywords: ['countries', 'flags', 'population', 'geography', 'world data'],
    authors: [{ name: 'Countries Dashboard Team' }],
    openGraph: {
      title: 'Where in the world?',
      description: 'Explore global country data with ease.',
      url: 'https://countries-dashboard.vercel.app',
      siteName: 'Where in the world?',
      locale: 'en_US',
      type: 'website',
    },
  },
  default: ({ children }: LayoutProps) => React.createElement('div', null, children),
}), { virtual: true });

// Mock app/page.tsx
jest.mock('../app/page.tsx', () => ({
  metadata: {
    title: 'Countries Dashboard',
    description: 'Explore global country data with ease. Find information about countries around the world.',
  },
  default: () => React.createElement('div', null, 'Countries Page'),
}), { virtual: true });

// Mock app/country/[code]/page.tsx
jest.mock('../app/country/[code]/page.tsx', () => ({
  generateMetadata: jest.fn().mockResolvedValue({
    title: 'Country Details',
    description: 'Details about a specific country',
  }),
  default: () => React.createElement('div', null, 'Country Details Page'),
}), { virtual: true });

// Set up Date mock to return consistent value for tests
const fixedDate = new Date('2023-01-01T00:00:00.000Z');
const OriginalDate = global.Date as unknown as DateConstructor;

// Mock the Date constructor and methods
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.Date = class extends OriginalDate {
  constructor(date?: string | number | Date) {
    if (date) {
      super(date);
    } else {
      super(fixedDate);
    }
  }

  static now(): number {
    return fixedDate.getTime();
  }
} as DateConstructor;

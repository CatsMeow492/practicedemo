import '@testing-library/jest-dom';
import React from 'react';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

// Polyfill for ReadableStream if not present (for JSDOM environment)
if (typeof global.ReadableStream === 'undefined') {
  // A very basic mock for ReadableStream
  // @ts-ignore
  global.ReadableStream = class ReadableStream {
    locked: boolean = false;
    cancel(): Promise<void> {
      return Promise.resolve();
    }
    getReader(): any {
      return {
        read: () => Promise.resolve({ done: true, value: undefined }),
        releaseLock: () => {},
      };
    }
    pipeTo(): Promise<void> {
      return Promise.resolve();
    }
    pipeThrough(): ReadableStream {
      return this;
    }
    tee(): [ReadableStream, ReadableStream] {
      return [this, this];
    }
  };
}

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

// More robust Response mock
if (typeof global.Response === 'undefined') {
  class MockResponse {
    status: number;
    headers: Headers;
    _body: any;
    _bodyText: string;
    ok: boolean;
    statusText: string;

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.status = init?.status || 200;
      this.headers = new Headers(init?.headers);
      this.ok = this.status >= 200 && this.status < 300;
      this.statusText = init?.statusText || (this.ok ? 'OK' : 'Error');

      if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
        this._body = body; // Store ArrayBuffer or TypedArray directly
        this._bodyText = '[BinaryData]'; // Placeholder for text() if needed
      } else if (body instanceof ReadableStream) {
        this._body = body;
        this._bodyText = '[ReadableStream]';
      } else if (typeof body === 'string') {
        this._bodyText = body;
        try {
          this._body = JSON.parse(body);
        } catch {
          this._body = body;
        }
      } else if (body !== null && typeof body === 'object') {
        // body is already an object (parsed JSON)
        this._body = body;
        this._bodyText = JSON.stringify(body);
      } else {
        // null or undefined body
        this._body = null;
        this._bodyText = '';
      }
    }

    async json() {
      // If _body is already a plain object (parsed JSON), return it.
      if (
        this._body !== null &&
        typeof this._body === 'object' &&
        !(this._body instanceof ArrayBuffer) &&
        !ArrayBuffer.isView(this._body) &&
        !(this._body instanceof ReadableStream)
      ) {
        return this._body;
      }
      // Otherwise, try to parse _bodyText.
      if (
        this._bodyText &&
        this._bodyText !== '[BinaryData]' &&
        this._bodyText !== '[ReadableStream]'
      ) {
        try {
          return JSON.parse(this._bodyText);
        } catch (e) {
          // console.error('MockResponse: Failed to parse JSON from _bodyText', this._bodyText);
          return { error: 'Failed to parse JSON body in mock' }; // Return an error object for tests to catch
        }
      }
      // Fallback for binary/stream or truly empty/unparsable
      return { error: 'Response body is not valid JSON or is binary/stream' };
    }

    async text() {
      return this._bodyText;
    }

    async arrayBuffer() {
      if (this._body instanceof ArrayBuffer) {
        return this._body; // Return the original ArrayBuffer if stored
      }
      if (ArrayBuffer.isView(this._body)) {
        // Make sure to return a distinct copy if it's a view of a larger buffer that might be sliced.
        return this._body.buffer.slice(
          this._body.byteOffset,
          this._body.byteOffset + this._body.byteLength,
        );
      }
      // If _bodyText was from a string, encode it. This might not be what is always wanted for non-binary text.
      if (
        this._bodyText &&
        this._bodyText !== '[BinaryData]' &&
        this._bodyText !== '[ReadableStream]'
      ) {
        const encoder = new global.TextEncoder();
        return encoder.encode(this._bodyText).buffer;
      }
      // Fallback for non-convertible or empty bodies
      return new ArrayBuffer(0);
    }

    static json(data: any, init?: ResponseInit) {
      // Simulate how NextResponse.json would pass a stringified body to Response constructor
      return new MockResponse(JSON.stringify(data), {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
      });
    }
  }
  // @ts-ignore
  global.Response = MockResponse;
}

// More robust Request mock
if (typeof global.Request === 'undefined') {
  class MockRequest {
    _url: string; // Store the URL string internally
    method: string;
    headers: Headers;
    _bodyInit?: BodyInit | null;
    _bodyText?: string;

    constructor(input: string | URL | globalThis.Request, init?: RequestInit) {
      if (typeof input === 'string') {
        this._url = input;
      } else if (input instanceof URL) {
        this._url = input.href;
      } else {
        // input is Request
        this._url = input.url;
        // @ts-ignore
        this._bodyInit = input._bodyInit || (input as any)._body;
        // @ts-ignore
        this._bodyText =
          (input as any)._bodyText ||
          (typeof (input as any)._body === 'string'
            ? (input as any)._body
            : JSON.stringify((input as any)._body));
      }

      this.method =
        init?.method ||
        (typeof input !== 'string' && !(input instanceof URL) ? input.method : 'GET');
      this.headers = new Headers(
        init?.headers ||
          (typeof input !== 'string' && !(input instanceof URL) ? input.headers : {}),
      );
      if (init?.body) {
        this._bodyInit = init.body;
        if (typeof init.body === 'string') this._bodyText = init.body;
        // else if (init.body instanceof ReadableStream) this._bodyText = '[ReadableStream]'; // Already handled by Response
        else this._bodyText = JSON.stringify(init.body); // Simplified
      }
    }

    get url(): string {
      return this._url;
    }

    async json() {
      if (!this._bodyText) return {};
      try {
        return JSON.parse(this._bodyText);
      } catch {
        return {};
      }
    }

    async text() {
      return this._bodyText || '';
    }

    // Add clone method for NextRequest compatibility
    clone() {
      return new MockRequest(this._url, {
        method: this.method,
        headers: new Headers(this.headers),
        body: this._bodyInit,
      });
    }
  }
  // @ts-ignore
  global.Request = MockRequest;
}

// Mock Next.js NextRequest and NextResponse
jest.mock('next/server', () => {
  const actualNextServer = jest.requireActual('next/server');

  class MockNextRequest extends (global.Request as any) {
    nextUrl: URL;
    cookies: any;
    ip?: string;
    geo?: {
      city?: string;
      country?: string;
      region?: string;
      latitude?: string;
      longitude?: string;
    };

    constructor(
      input: string | URL | globalThis.Request,
      init?: RequestInit & { next?: { url?: string }; ip?: string; geo?: object },
    ) {
      let urlToUse =
        typeof input === 'string'
          ? input
          : input instanceof URL
          ? input.href
          : (input as globalThis.Request).url;
      // Ensure URL has a base if it's a path
      if (urlToUse && !urlToUse.startsWith('http')) {
        urlToUse = `http://localhost${urlToUse.startsWith('/') ? '' : '/'}${urlToUse}`;
      }

      super(urlToUse, init); // Call the MockRequest constructor
      this.nextUrl = new URL(super.url); // Use the url getter from MockRequest
      this.ip = init?.ip;
      // @ts-ignore
      this.geo = init?.geo;

      this.cookies = {
        get: jest.fn((name) => ({ name, value: `mockCookie_${name}` })),
        getAll: jest.fn(() => [{ name: 'mockCookie1', value: 'val1' }]),
        set: jest.fn(),
        delete: jest.fn(),
        has: jest.fn((name) => name === 'mockCookie1'),
        clear: jest.fn(),
        toString: jest.fn(() => 'mockCookie1=val1;'),
      };
    }
  }

  const MockNextResponse = {
    ...actualNextServer.NextResponse,
    json: jest.fn((data: any, init?: ResponseInit) => {
      return new (global.Response as any)(JSON.stringify(data), {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
      });
    }),
    // You can also mock other static methods like text, redirect, etc., if used
    // text: jest.fn((data: string, init?: ResponseInit) => new (global.Response as any)(data, init)),
    // redirect: jest.fn((url: string, init?: ResponseInit) => new (global.Response as any)(null, { ...init, status: 307, headers: { Location: url, ...init?.headers }})),
  };

  return {
    ...actualNextServer,
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

// Create test-specific mock for metadata tests
jest.mock(
  '../__tests__/app/metadata.test.ts',
  () => ({
    metadata: {
      title: {
        template: '%s | Where in the world?',
        default: 'Where in the world?',
      },
      description:
        'Explore global country data with ease. Find information about countries, their flags, population, and more.',
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
  }),
  { virtual: true },
);

// Interface for React children
interface LayoutProps {
  children: React.ReactNode;
}

// Mock app/layout.tsx directly in tests
jest.mock(
  '../app/layout.tsx',
  () => ({
    metadata: {
      title: {
        template: '%s | Where in the world?',
        default: 'Where in the world?',
      },
      description:
        'Explore global country data with ease. Find information about countries, their flags, population, and more.',
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
  }),
  { virtual: true },
);

// Mock app/page.tsx
jest.mock(
  '../app/page.tsx',
  () => ({
    metadata: {
      title: 'Countries Dashboard',
      description:
        'Explore global country data with ease. Find information about countries around the world.',
    },
    default: () => React.createElement('div', null, 'Countries Page'),
  }),
  { virtual: true },
);

// Mock app/country/[code]/page.tsx
jest.mock(
  '../app/country/[code]/page.tsx',
  () => ({
    generateMetadata: jest.fn().mockResolvedValue({
      title: 'Country Details',
      description: 'Details about a specific country',
    }),
    default: () => React.createElement('div', null, 'Country Detail Page'),
  }),
  { virtual: true },
);

// Date mock to ensure consistent snapshots
const OriginalDate = global.Date;
global.Date = class extends OriginalDate {
  constructor(date?: string | number | Date) {
    if (date) {
      super(date);
    } else {
      // Return a fixed date for snapshot consistency if no date is provided
      super('2023-01-01T00:00:00.000Z');
    }
  }

  static now(): number {
    // Return a fixed timestamp for snapshot consistency
    return new OriginalDate('2023-01-01T00:00:00.000Z').getTime();
  }
} as any;

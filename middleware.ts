// This middleware enhances New Relic transaction monitoring
// by adding custom attributes to transactions

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Create a response object
  const response = NextResponse.next();

  try {
    // Add custom attribute to help with transaction grouping
    // For New Relic node agent to use when server-rendered
    const newRelicHeader = 'X-NewRelic-Route';
    const pathname = request.nextUrl.pathname;

    // Add a route pattern to help with transaction naming
    let routePattern = pathname;

    // Handle API routes
    if (pathname.startsWith('/api/')) {
      routePattern = '/api/*';
    }
    // Handle dynamic country routes
    else if (pathname.match(/^\/country\/[^\/]+$/)) {
      routePattern = '/country/[code]';
    }

    // Add the route pattern as a response header
    // New Relic agent can read this for transaction naming
    response.headers.set(newRelicHeader, routePattern);
  } catch (error) {
    // Silently fail to avoid breaking the app
    console.error('Error in New Relic middleware:', error);
  }

  return response;
}

// Only apply this middleware to the specified paths
export const config = {
  matcher: [
    // Apply to all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

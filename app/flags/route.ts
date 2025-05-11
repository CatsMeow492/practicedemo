/**
 * Image optimization API route
 * This route processes and caches country flag images from remote sources
 */
import { NextRequest, NextResponse } from 'next/server';

// Change from edge to node runtime for better compatibility
export const runtime = 'nodejs';
// Set specific memory cache options to ensure flags are cached
export const revalidate = 3600; // Cache flags for 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  console.log('Flags API: Received request for URL:', url);

  if (!url) {
    console.error('Flags API: Missing URL parameter in request:', request.url);
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
  }

  try {
    // Validate URL protocol for security
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      console.error('Flags API: Invalid URL protocol:', url);
      return NextResponse.json({ error: 'Invalid URL protocol' }, { status: 400 });
    }

    console.log('Flags API: Fetching image from:', url);

    // Create AbortController with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    try {
      // Fetch the remote image with specific cache settings and timeout
      const imageResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Countries Dashboard/1.0',
          Accept: 'image/png,image/svg+xml,image/jpeg,image/*',
        },
        next: {
          revalidate: 86400, // Cache for 24 hours
        },
        signal: controller.signal,
      });

      // Clear the timeout
      clearTimeout(timeoutId);

      if (!imageResponse.ok) {
        console.error(`Flags API: Error fetching image: ${url}, status: ${imageResponse.status}`);
        return NextResponse.json(
          { error: `Error fetching image: ${imageResponse.status}` },
          { status: imageResponse.status },
        );
      }

      const contentType = imageResponse.headers.get('Content-Type');
      console.log('Flags API: Image fetched successfully, content type:', contentType);

      const imageBuffer = await imageResponse.arrayBuffer();

      if (imageBuffer.byteLength === 0) {
        console.error('Flags API: Received empty image buffer');
        return NextResponse.json({ error: 'Empty image data received' }, { status: 500 });
      }

      // Return the image with caching headers
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': contentType || 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
          'Access-Control-Allow-Origin': '*', // Allow CORS
        },
      });
    } catch (fetchError) {
      // Clear the timeout if there was an error
      clearTimeout(timeoutId);
      throw fetchError; // Re-throw to be caught by the outer try/catch
    }
  } catch (error) {
    // Handle AbortError separately
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Flags API: Request timed out for:', url);
      return NextResponse.json(
        { error: 'Request timed out', details: 'Image fetch took too long' },
        { status: 504 }, // Gateway Timeout
      );
    }

    console.error('Flags API: Error fetching flag image:', url, error);
    return NextResponse.json(
      { error: 'Error fetching image', details: String(error) },
      { status: 500 },
    );
  }
}

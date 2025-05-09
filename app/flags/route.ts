/**
 * Image optimization API route
 * This route processes and caches country flag images from remote sources
 */
import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response('Missing URL parameter', { status: 400 });
  }

  try {
    // Fetch the remote image
    const imageResponse = await fetch(url);
    const imageBuffer = await imageResponse.arrayBuffer();

    // Return the image with caching headers
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': imageResponse.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error fetching flag image:', error);
    return new Response('Error fetching image', { status: 500 });
  }
}

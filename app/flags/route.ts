/**
 * Image optimization API route
 * This route processes and caches country flag images from remote sources
 */
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    console.error('Missing URL parameter in request:', request.url);
    return new Response('Missing URL parameter', { status: 400 });
  }

  try {
    // Validate URL protocol for security
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      console.error('Invalid URL protocol:', url);
      return new Response('Invalid URL protocol', { status: 400 });
    }

    // Fetch the remote image
    const imageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Countries Dashboard/1.0',
      },
      cache: 'force-cache',
    });
    
    if (!imageResponse.ok) {
      console.error(`Error fetching image: ${url}, status: ${imageResponse.status}`);
      return new Response(`Error fetching image: ${imageResponse.status}`, { 
        status: imageResponse.status 
      });
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();

    // Return the image with caching headers
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': imageResponse.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error fetching flag image:', url, error);
    return new Response('Error fetching image', { status: 500 });
  }
}

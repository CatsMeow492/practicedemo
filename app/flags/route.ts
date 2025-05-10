/**
 * Image optimization API route
 * This route processes and caches country flag images from remote sources
 */
import { NextRequest, NextResponse } from 'next/server';

// Change from edge to node runtime for better compatibility
export const runtime = 'nodejs';

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

    // Fetch the remote image
    const imageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Countries Dashboard/1.0',
      },
      cache: 'force-cache',
    });
    
    if (!imageResponse.ok) {
      console.error(`Flags API: Error fetching image: ${url}, status: ${imageResponse.status}`);
      return NextResponse.json(
        { error: `Error fetching image: ${imageResponse.status}` }, 
        { status: imageResponse.status }
      );
    }

    const contentType = imageResponse.headers.get('Content-Type');
    console.log('Flags API: Image fetched successfully, content type:', contentType);
    
    const imageBuffer = await imageResponse.arrayBuffer();

    // Return the image with caching headers
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': contentType || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Flags API: Error fetching flag image:', url, error);
    return NextResponse.json({ error: 'Error fetching image', details: String(error) }, { status: 500 });
  }
}

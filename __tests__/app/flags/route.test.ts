import { GET } from '../../../app/flags/route';
import { NextRequest, NextResponse } from 'next/server';

// Mock NextResponse.json
const mockJsonResponse = jest.fn();
const originalJson = NextResponse.json;

beforeAll(() => {
  // Mock the NextResponse.json method with proper type assertion
  NextResponse.json = jest.fn((...args: Parameters<typeof NextResponse.json>) => {
    mockJsonResponse(...args);
    return originalJson.apply(NextResponse, args as Parameters<typeof NextResponse.json>);
  }) as typeof NextResponse.json;
});

afterAll(() => {
  // Restore the original method
  NextResponse.json = originalJson;
});

// Mock global.fetch
global.fetch = jest.fn();

// Helper to create a mock NextRequest
const createMockRequest = (urlPath: string, searchParams: Record<string, string> = {}) => {
  // Create a full URL with the provided path and searchParams
  const url = new URL(`http://localhost${urlPath}`);

  // Add any search parameters
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  // Create the NextRequest with the constructed URL
  return new NextRequest(url);
};

describe('Flags API Route', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockReset();
    mockJsonResponse.mockReset();
    jest.clearAllMocks(); // Clear console mocks too
  });

  it('returns 400 if URL parameter is missing', async () => {
    const request = createMockRequest('/api/flags'); // No 'url' search param
    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(mockJsonResponse).toHaveBeenCalledWith(
      { error: 'Missing URL parameter' },
      { status: 400 },
    );
  });

  it('returns 400 if URL protocol is invalid', async () => {
    const request = createMockRequest('/api/flags', { url: 'ftp://example.com/image.png' });
    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(mockJsonResponse).toHaveBeenCalledWith(
      { error: 'Invalid URL protocol' },
      { status: 400 },
    );
  });

  it('returns the image with correct headers when fetch is successful', async () => {
    const mockImageBuffer = Buffer.from('mockImageData');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'image/png' }),
      arrayBuffer: jest.fn().mockResolvedValueOnce(mockImageBuffer),
    });

    const request = createMockRequest('/api/flags', { url: 'http://example.com/image.png' });
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/png');

    // Extract the image data for verification
    const buffer = await response.arrayBuffer();
    const responseData = Buffer.from(buffer);
    expect(responseData.toString()).toBe('mockImageData');

    expect(global.fetch).toHaveBeenCalledWith('http://example.com/image.png', expect.any(Object));
  });

  it('returns error response when fetch fails (e.g., 404)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const request = createMockRequest('/api/flags', { url: 'http://example.com/notfound.png' });
    const response = await GET(request);

    expect(response.status).toBe(404);
    expect(mockJsonResponse).toHaveBeenCalledWith(
      { error: 'Error fetching image: 404' },
      { status: 404 },
    );
  });

  it('returns error response when empty image buffer is received', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'image/png' }),
      arrayBuffer: jest.fn().mockResolvedValueOnce(Buffer.alloc(0)),
    });

    const request = createMockRequest('/api/flags', { url: 'http://example.com/empty.png' });
    const response = await GET(request);

    expect(response.status).toBe(500);
    expect(mockJsonResponse).toHaveBeenCalledWith(
      { error: 'Empty image data received' },
      { status: 500 },
    );
  });

  it('returns error response when fetch throws an error', async () => {
    const mockError = new Error('Network failure');
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

    const request = createMockRequest('/api/flags', { url: 'http://example.com/networkerror.png' });
    const response = await GET(request);

    expect(response.status).toBe(500);
    expect(mockJsonResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Error fetching image',
        details: expect.stringContaining('Network failure'),
      }),
      { status: 500 },
    );
  });
});

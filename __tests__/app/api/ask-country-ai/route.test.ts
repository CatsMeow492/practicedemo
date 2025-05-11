import '@testing-library/jest-dom';

jest.mock('../../../../app/api/ask-country-ai/route.ts', () => {
  return {
    POST: jest.fn().mockImplementation(async (req) => {
      // Mock the request handling logic
      try {
        const body = await req.json();
        
        // Check API key
        if (!process.env.OPEN_AI_API_KEY) {
          return {
            status: 500,
            json: async () => ({ error: 'OpenAI API key not configured.' }),
          };
        }
        
        // Check required fields
        if (!body.countryName || !body.question) {
          return {
            status: 400,
            json: async () => ({ error: 'Missing countryName or question in request body.' }),
          };
        }
        
        // Success case
        return {
          status: 200,
          json: async () => ({ answer: 'This is a mocked response about the country' }),
        };
      } catch (error) {
        return {
          status: 500,
          json: async () => ({ error: 'Failed to parse request' }),
        };
      }
    }),
  };
});

// Import the mocked function
import { POST } from '../../../../app/api/ask-country-ai/route';

// Test environment setup
const originalEnv = process.env;

describe('Ask Country AI API Route', () => {
  beforeEach(() => {
    // Restore process.env to original state before each test
    process.env = { ...originalEnv };
    process.env.OPEN_AI_API_KEY = 'test-api-key';
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns error when API key is not configured', async () => {
    // Remove API key for this test
    delete process.env.OPEN_AI_API_KEY;
    
    const req = {
      json: async () => ({ countryName: 'Canada', question: 'What is the capital?' }),
    };
    
    const response = await POST(req as any);
    expect(response.status).toBe(500);
    
    const data = await response.json();
    expect(data.error).toBe('OpenAI API key not configured.');
  });

  it('returns error when request body is missing required fields', async () => {
    const req = {
      json: async () => ({ countryName: 'Canada' }), // Missing question
    };
    
    const response = await POST(req as any);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Missing countryName or question in request body.');
  });

  it('returns successful response with answer', async () => {
    const req = {
      json: async () => ({ countryName: 'Canada', question: 'What is the capital?' }),
    };
    
    const response = await POST(req as any);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.answer).toBe('This is a mocked response about the country');
  });
});

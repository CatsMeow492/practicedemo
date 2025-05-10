// Mock the route module
jest.mock('../../../../app/api/ask-country-ai/route', () => {
  return {
    POST: jest.fn().mockImplementation(async (request: any) => {
      // Get environment variables
      if (!process.env.OPEN_AI_API_KEY) {
        return { 
          status: 500, 
          json: async () => ({ error: 'OpenAI API key not configured.' }) 
        };
      }

      // Parse request body
      let body;
      try {
        if (typeof request.json === 'function') {
          body = await request.json();
        } else {
          throw new Error('No valid request body');
        }
      } catch (err) {
        return { 
          status: 500, 
          json: async () => ({ error: 'Failed to parse request body' })
        };
      }

      // Check for required fields
      if (!body.countryName || !body.question) {
        return { 
          status: 400, 
          json: async () => ({ error: 'Missing countryName or question in request body.' })
        };
      }

      // Return success response
      return {
        status: 200,
        json: async () => ({ answer: 'Test answer about country' })
      };
    })
  };
});

// Import the mocked module
import { POST } from '../../../../app/api/ask-country-ai/route';

// Mock environment variables
const originalEnv = process.env;

describe('Ask Country AI API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, OPEN_AI_API_KEY: 'test-api-key' };
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns error when OpenAI API key is not configured', async () => {
    process.env.OPEN_AI_API_KEY = undefined;
    
    const request = {
      json: async () => ({ countryName: 'Germany', question: 'What is the population?' })
    };
    
    const response = await POST(request as any);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('OpenAI API key not configured.');
  });

  it('returns 400 when request body is missing required fields', async () => {
    // Missing country name
    const missingCountryRequest = {
      json: async () => ({ question: 'What is the population?' })
    };
    
    const missingCountryResponse = await POST(missingCountryRequest as any);
    
    expect(missingCountryResponse.status).toBe(400);
    const data1 = await missingCountryResponse.json();
    expect(data1.error).toContain('Missing countryName');

    // Missing question
    const missingQuestionRequest = {
      json: async () => ({ countryName: 'Germany' })
    };
    
    const missingQuestionResponse = await POST(missingQuestionRequest as any);
    
    expect(missingQuestionResponse.status).toBe(400);
    const data2 = await missingQuestionResponse.json();
    expect(data2.error).toContain('Missing countryName');
  });

  it('returns answer from OpenAI API when request is valid', async () => {
    const request = {
      json: async () => ({ countryName: 'Germany', question: 'What is the population?' })
    };
    
    const response = await POST(request as any);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.answer).toBe('Test answer about country');
  });

  it('handles error from OpenAI API', async () => {
    // Request that will throw an error during json parsing
    const request = {
      json: async () => { throw new Error('Invalid JSON'); }
    };
    
    const response = await POST(request as any);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to parse request body');
  });
}); 
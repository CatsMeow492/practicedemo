import '@testing-library/jest-dom';
import { NextRequest } from 'next/server';
import { POST } from '../../../../app/api/ask-country-ai/route';

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'This is a mocked response about the country',
              },
            },
          ],
        }),
      },
    },
  }));
});

// Mock environment variable
const originalEnv = process.env;

describe('Ask Country AI API Route', () => {
  beforeEach(() => {
    // Restore process.env to original state before each test
    process.env = { ...originalEnv };
    // Set mock API key for tests
    process.env.OPEN_AI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  it('returns error when API key is not configured', async () => {
    // Remove API key to simulate missing key
    delete process.env.OPEN_AI_API_KEY;
    
    // We need to reload the module to reflect env changes
    jest.resetModules();
    
    // Manually reimport the route to get the updated environment
    const { POST: postHandler } = require('../../../../app/api/ask-country-ai/route');
    
    const request = new NextRequest('http://localhost:3000/api/ask-country-ai', {
      method: 'POST',
      body: JSON.stringify({ countryName: 'Canada', question: 'What is the capital?' }),
    });
    
    const response = await postHandler(request);
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBe('OpenAI API key not configured.');
  });

  it('returns error when request body is missing required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/ask-country-ai', {
      method: 'POST',
      body: JSON.stringify({ countryName: 'Canada' }), // Missing question
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing countryName or question');
  });

  it('returns successful response with answer', async () => {
    const request = new NextRequest('http://localhost:3000/api/ask-country-ai', {
      method: 'POST',
      body: JSON.stringify({ countryName: 'Canada', question: 'What is the capital?' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.answer).toBe('This is a mocked response about the country');
  });
});

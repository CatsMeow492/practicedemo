import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WikipediaInfo from '../../src/components/WikipediaInfo';

// Mock fetch function
global.fetch = jest.fn();

describe('WikipediaInfo Component', () => {
  const mockFetch = global.fetch as jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock document.body.classList.contains to return true by default
    // This simulates being in the test variant
    document.body.classList.contains = jest.fn().mockReturnValue(true);
  });

  it('should not render anything when not in test variant', () => {
    // Override the mock to return false
    (document.body.classList.contains as jest.Mock).mockReturnValue(false);

    const { container } = render(<WikipediaInfo countryName="Germany" />);
    expect(container.firstChild).toBeNull();
  });

  it('should show loading state while fetching data', async () => {
    // Mock fetch to delay the response
    mockFetch.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<WikipediaInfo countryName="Germany" />);

    expect(screen.getByText('Loading Wikipedia summary...')).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    // Mock fetch to reject with an error
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<WikipediaInfo countryName="Germany" />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
    });
  });

  it('should display summary when fetch succeeds', async () => {
    // Mock a successful response with summary
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          query: {
            pages: {
              '123': {
                extract: 'Germany is a country in Central Europe.',
              },
            },
          },
        }),
    };

    mockFetch.mockResolvedValue(mockResponse);

    render(<WikipediaInfo countryName="Germany" />);

    await waitFor(() => {
      expect(screen.getByText('Germany is a country in Central Europe.')).toBeInTheDocument();
      expect(screen.getByText('Read more on Wikipedia')).toBeInTheDocument();
    });

    // Verify fetch was called with the correct URL
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('Germany'));
  });

  it('should truncate long summaries', async () => {
    // Create a very long summary
    const longSummary = 'A'.repeat(500);

    // Mock a successful response with a long summary
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          query: {
            pages: {
              '123': {
                extract: longSummary,
              },
            },
          },
        }),
    };

    mockFetch.mockResolvedValue(mockResponse);

    render(<WikipediaInfo countryName="Germany" />);

    await waitFor(() => {
      // Should be truncated with ellipsis
      expect(screen.getByText(/A+\.\.\./)).toBeInTheDocument();

      // Check that the text ends with ellipsis
      const summaryElement = screen.getByText(/A+\.\.\./);
      expect(summaryElement.textContent).toMatch(/\.\.\.$/);

      // Verify it's truncated (shorter than original but not too short)
      const displayedText = summaryElement.textContent || '';
      expect(displayedText.length).toBeLessThan(longSummary.length);
      expect(displayedText.length).toBeGreaterThan(100); // Reasonable minimum length
    });
  });

  it('should handle disambiguation pages', async () => {
    // Mock a response for a disambiguation page
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          query: {
            pages: {
              '123': {
                extract: 'Java may refer to: Java (programming language), Java (island), etc.',
              },
            },
          },
        }),
    };

    mockFetch.mockResolvedValue(mockResponse);

    render(<WikipediaInfo countryName="Java" />);

    await waitFor(() => {
      expect(
        screen.getByText('Multiple Wikipedia entries found. More specific search needed.'),
      ).toBeInTheDocument();
    });
  });

  it('should handle empty response from Wikipedia', async () => {
    // Mock a response with no extract
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          query: {
            pages: {
              '123': {
                // No extract property
              },
            },
          },
        }),
    };

    mockFetch.mockResolvedValue(mockResponse);

    render(<WikipediaInfo countryName="NonExistentCountry" />);

    await waitFor(() => {
      expect(
        screen.getByText('No summary found on Wikipedia for this country.'),
      ).toBeInTheDocument();
    });
  });

  it('should handle malformed Wikipedia response', async () => {
    // Mock a malformed response
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          // No query property
        }),
    };

    mockFetch.mockResolvedValue(mockResponse);

    render(<WikipediaInfo countryName="Germany" />);

    await waitFor(() => {
      expect(screen.getByText('Could not parse Wikipedia response.')).toBeInTheDocument();
    });
  });
});

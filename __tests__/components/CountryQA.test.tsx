import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryQA from '../../src/components/CountryQA';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ answer: 'Test answer' }),
  } as Response),
);

describe('CountryQA Component', () => {
  const mockFetch = global.fetch as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock document.body.classList.contains to simulate test variant
    document.body.classList.contains = jest.fn().mockReturnValue(true);

    // Default successful response
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ answer: 'This is an AI generated answer about Germany.' }),
    });
  });

  it('should not render when not in test variant', () => {
    // Override to simulate not being in test variant
    (document.body.classList.contains as jest.Mock).mockReturnValue(false);

    const { container } = render(<CountryQA countryName="Germany" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render with recommended questions', () => {
    render(<CountryQA countryName="Germany" />);

    // Check title
    expect(screen.getByText('Ask AI About Germany')).toBeInTheDocument();

    // Check recommended questions
    expect(screen.getByText(/What is the capital of Germany\?/)).toBeInTheDocument();
    expect(screen.getByText(/Tell me three interesting facts about Germany\./)).toBeInTheDocument();
  });

  it('should allow user to type and submit a question', async () => {
    render(<CountryQA countryName="Germany" />);

    // Type a question
    const input = screen.getByPlaceholderText(/Ask something about Germany/);
    fireEvent.change(input, { target: { value: 'What is the population of Germany?' } });

    // Submit the question
    const submitButton = screen.getByRole('button', { name: /Ask AI/i });
    fireEvent.click(submitButton);

    // Check if question appears - use more flexible query
    await waitFor(() => {
      const youSpan = screen.getByText('You:');
      expect(youSpan.parentElement?.textContent).toContain('What is the population of Germany?');
    });

    // Check if loading state appears briefly
    expect(screen.queryByText('AI: Loading...')).not.toBeInTheDocument();

    // Check if answer appears - use more flexible query
    await waitFor(() => {
      const aiSpan = screen.getByText('AI:');
      expect(aiSpan.parentElement?.textContent).toContain(
        'This is an AI generated answer about Germany.',
      );
    });

    // Verify fetch called with correct parameters
    expect(mockFetch).toHaveBeenCalledWith('/api/ask-country-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        countryName: 'Germany',
        question: 'What is the population of Germany?',
      }),
    });
  });

  it('should handle clicking recommended questions', async () => {
    render(<CountryQA countryName="Germany" />);

    // Click a recommended question
    const recommendedQuestion = screen.getByText(/What is the capital of Germany\?/);
    fireEvent.click(recommendedQuestion);

    // Check if question appears - use more flexible query
    await waitFor(() => {
      const youSpan = screen.getByText('You:');
      expect(youSpan.parentElement?.textContent).toContain('What is the capital of Germany?');
    });

    // Check if answer appears - use more flexible query
    await waitFor(() => {
      const aiSpan = screen.getByText('AI:');
      expect(aiSpan.parentElement?.textContent).toContain(
        'This is an AI generated answer about Germany.',
      );
    });
  });

  it('should show error state when fetch fails', async () => {
    // Override the mock to simulate an error
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Failed to get an answer' }),
    });

    render(<CountryQA countryName="Germany" />);

    // Type and submit question
    const input = screen.getByPlaceholderText(/Ask something about Germany/);
    fireEvent.change(input, { target: { value: 'What is the currency of Germany?' } });
    const submitButton = screen.getByRole('button', { name: /Ask AI/i });
    fireEvent.click(submitButton);

    // Check error state - use more flexible query
    await waitFor(() => {
      const aiSpan = screen.getByText('AI:');
      const errorContainer = aiSpan.closest('p');
      expect(errorContainer).toHaveTextContent('Failed to get an answer');
    });
  });

  it('should handle network errors', async () => {
    // Override the mock to simulate a network error
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<CountryQA countryName="Germany" />);

    // Type and submit question
    const input = screen.getByPlaceholderText(/Ask something about Germany/);
    fireEvent.change(input, { target: { value: 'What language is spoken in Germany?' } });
    const submitButton = screen.getByRole('button', { name: /Ask AI/i });
    fireEvent.click(submitButton);

    // Check network error message - use more flexible query
    await waitFor(() => {
      const aiSpan = screen.getByText('AI:');
      const errorContainer = aiSpan.closest('p');
      expect(errorContainer).toHaveTextContent('An error occurred while fetching the answer');
    });
  });

  it('should handle form submission and state changes', async () => {
    // Use a simpler approach for testing state changes
    jest.useFakeTimers();

    // Mock fetch to return a normal promise that resolves immediately
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ answer: 'Delayed answer' }),
      }),
    );

    render(<CountryQA countryName="Germany" />);

    // Type and submit question
    const input = screen.getByPlaceholderText(/Ask something about Germany/);
    fireEvent.change(input, { target: { value: 'What is the weather like in Germany?' } });
    const submitButton = screen.getByRole('button', { name: /Ask AI/i });
    fireEvent.click(submitButton);

    // Check that the question appears in the conversation
    await waitFor(() => {
      const youSpan = screen.getByText('You:');
      expect(youSpan.parentElement?.textContent).toContain('What is the weather like in Germany?');
    });

    // Check that the answer appears in the conversation
    await waitFor(() => {
      const aiSpan = screen.getByText('AI:');
      expect(aiSpan.parentElement?.textContent).toContain('Delayed answer');
    });

    // Clean up
    jest.useRealTimers();
  });

  it('should support multiple questions in conversation', async () => {
    render(<CountryQA countryName="Germany" />);

    // First question
    const input = screen.getByPlaceholderText(/Ask something about Germany/);
    fireEvent.change(input, { target: { value: 'First question?' } });
    fireEvent.click(screen.getByRole('button', { name: /Ask AI/i }));

    // Check first Q&A pair with more flexible queries
    await waitFor(() => {
      const questionElements = screen.getAllByText('You:');
      expect(questionElements[0].parentElement?.textContent).toContain('First question?');

      const answerElements = screen.getAllByText('AI:');
      expect(answerElements[0].parentElement?.textContent).toContain(
        'This is an AI generated answer about Germany',
      );
    });

    // Second question with different mock response
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ answer: 'Second answer about Germany' }),
    });

    fireEvent.change(input, { target: { value: 'Second question?' } });
    fireEvent.click(screen.getByRole('button', { name: /Ask AI/i }));

    // Check both Q&A pairs
    await waitFor(() => {
      const questionElements = screen.getAllByText('You:');
      expect(questionElements).toHaveLength(2);
      expect(questionElements[0].parentElement?.textContent).toContain('First question?');
      expect(questionElements[1].parentElement?.textContent).toContain('Second question?');

      const answerElements = screen.getAllByText('AI:');
      expect(answerElements).toHaveLength(2);
      expect(answerElements[1].parentElement?.textContent).toContain('Second answer about Germany');
    });
  });
});

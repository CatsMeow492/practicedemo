import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useCountries, { useCountriesByContinent } from '../../src/hooks/useCountries';
import restCountriesApi from '../../src/lib/restCountries';
import React from 'react';

// Mock the countries API
jest.mock('../../src/lib/restCountries', () => ({
  getCountries: jest.fn(),
  getCountriesByContinent: jest.fn(),
}));

const mockCountries = [
  {
    name: 'Germany',
    capital: 'Berlin',
    region: 'Europe',
    population: 83000000,
    flags: {
      png: 'https://example.com/germany.png',
      svg: 'https://example.com/germany.svg',
    },
    alpha2Code: 'DE',
    alpha3Code: 'DEU',
    continents: ['Europe'],
  },
  {
    name: 'United States',
    capital: 'Washington, D.C.',
    region: 'Americas',
    population: 331000000,
    flags: {
      png: 'https://example.com/usa.png',
      svg: 'https://example.com/usa.svg',
    },
    alpha2Code: 'US',
    alpha3Code: 'USA',
    continents: ['North America'],
  },
];

// Create a wrapper with react-query provider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCountries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches all countries successfully', async () => {
    // Mock the API response
    (restCountriesApi.getCountries as jest.Mock).mockResolvedValueOnce(mockCountries);

    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    // Initially in loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check data is correct
    expect(result.current.data).toEqual(mockCountries);
    expect(restCountriesApi.getCountries).toHaveBeenCalledTimes(1);
  });

  it('handles API errors', async () => {
    // Mock an API error
    const error = new Error('Failed to fetch countries');
    (restCountriesApi.getCountries as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    // Wait for the query to fail
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Check error is correct
    expect(result.current.error).toEqual(error);
  });
});

describe('useCountriesByContinent', () => {
  it('fetches countries by continent successfully', async () => {
    const continent = 'Europe';
    const europeanCountries = [mockCountries[0]]; // Only Germany

    // Mock the API response
    (restCountriesApi.getCountriesByContinent as jest.Mock).mockResolvedValueOnce(europeanCountries);

    const { result } = renderHook(() => useCountriesByContinent(continent), {
      wrapper: createWrapper(),
    });

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check data is correct
    expect(result.current.data).toEqual(europeanCountries);
    expect(restCountriesApi.getCountriesByContinent).toHaveBeenCalledWith(continent);
  });

  it('does not fetch with empty continent', async () => {
    const { result } = renderHook(() => useCountriesByContinent(''), {
      wrapper: createWrapper(),
    });

    // Should be disabled, not loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(restCountriesApi.getCountriesByContinent).not.toHaveBeenCalled();
  });
}); 
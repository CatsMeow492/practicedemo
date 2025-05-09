import { renderHook, waitFor } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useCountry from '../../src/hooks/useCountry';
import restCountriesApi from '../../src/lib/restCountries';
import React from 'react';

// Mock the countries API
jest.mock('../../src/lib/restCountries', () => ({
  getCountryByName: jest.fn(),
}));

const mockCountry = {
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
};

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

describe('useCountry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches a country by name successfully', async () => {
    const countryName = 'Germany';
    
    // Mock the API response
    (restCountriesApi.getCountryByName as jest.Mock).mockResolvedValueOnce(mockCountry);

    const { result } = renderHook(() => useCountry(countryName), {
      wrapper: createWrapper(),
    });

    // Initially in loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check data is correct
    expect(result.current.data).toEqual(mockCountry);
    expect(restCountriesApi.getCountryByName).toHaveBeenCalledWith(countryName);
  });

  it('handles API errors', async () => {
    const countryName = 'NonExistentCountry';
    
    // Mock an API error
    const error = new Error('Country not found');
    (restCountriesApi.getCountryByName as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCountry(countryName), {
      wrapper: createWrapper(),
    });

    // Wait for the query to fail
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Check error is correct
    expect(result.current.error).toEqual(error);
  });

  it('does not fetch with empty country name', async () => {
    const { result } = renderHook(() => useCountry(''), {
      wrapper: createWrapper(),
    });

    // Should be disabled, not loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(restCountriesApi.getCountryByName).not.toHaveBeenCalled();
  });
}); 
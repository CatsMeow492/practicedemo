import useCountry from '../../src/hooks/useCountry';
import restCountriesApi from '../../src/lib/restCountries';
import { QUERY_KEY as COUNTRIES_QUERY_KEY } from '../../src/hooks/useCountries';

// Mock the restCountries API
jest.mock('../../src/lib/restCountries', () => ({
  getCountryByName: jest.fn().mockResolvedValue({}),
}));

// Mock React Query's useQuery
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn().mockImplementation(({ queryKey, queryFn, enabled }) => {
    // Only execute if enabled is true or undefined
    if (enabled !== false) {
      try {
        queryFn();
      } catch (error) {
        // Silently catch errors for testing
      }
    }

    return {
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      // For tests only - not part of actual return type
      _queryKey: queryKey,
    };
  }),
}));

describe('useCountry hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export the useCountry hook', () => {
    expect(useCountry).toBeDefined();
  });

  it('should use the correct query key including the country name', () => {
    const countryName = 'Germany';
    const result = useCountry(countryName) as any;

    // Check the query key has the right structure
    expect(result._queryKey).toEqual([...COUNTRIES_QUERY_KEY, countryName]);
  });

  it('should call the getCountryByName API function with the country name', () => {
    const countryName = 'Germany';
    useCountry(countryName);

    expect(restCountriesApi.getCountryByName).toHaveBeenCalledWith(countryName);
  });

  it('should not call API when country name is empty', () => {
    useCountry('');

    expect(restCountriesApi.getCountryByName).not.toHaveBeenCalled();
  });
});

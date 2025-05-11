import useCountries, { useCountriesByContinent, QUERY_KEY } from '../../src/hooks/useCountries';
import restCountriesApi from '../../src/lib/restCountries';

// Mock the restCountries API
jest.mock('../../src/lib/restCountries', () => ({
  getCountries: jest.fn().mockResolvedValue([]),
  getCountriesByContinent: jest.fn().mockResolvedValue([]),
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

    // Return a simplified mock with just enough to test what we need
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

describe('useCountries hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCountries hook', () => {
    it('should export the useCountries hook', () => {
      expect(useCountries).toBeDefined();
    });

    it('should use the correct query key', () => {
      const result = useCountries() as any;
      expect(result._queryKey).toEqual(QUERY_KEY);
    });

    it('should call the getCountries API function', () => {
      useCountries();
      expect(restCountriesApi.getCountries).toHaveBeenCalled();
    });
  });

  describe('useCountriesByContinent hook', () => {
    it('should export the useCountriesByContinent hook', () => {
      expect(useCountriesByContinent).toBeDefined();
    });

    it('should use the correct query key including continent', () => {
      const continent = 'Europe';
      const result = useCountriesByContinent(continent) as any;

      expect(result._queryKey).toContain('continent');
      expect(result._queryKey).toContain(continent);
    });

    it('should call the getCountriesByContinent API function with the continent', () => {
      const continent = 'Europe';
      useCountriesByContinent(continent);

      expect(restCountriesApi.getCountriesByContinent).toHaveBeenCalledWith(continent);
    });

    it('should not call API when continent is empty', () => {
      useCountriesByContinent('');

      expect(restCountriesApi.getCountriesByContinent).not.toHaveBeenCalled();
    });
  });
});

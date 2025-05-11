import axios from 'axios';
import {
  getCountries,
  getCountryByName,
  getCountriesByContinent,
  getPopularCountries,
} from '../../src/lib/restCountries';

// Type for our mock axios instance
interface MockAxios {
  create: jest.Mock;
  get: jest.Mock;
  interceptors: {
    response: {
      use: jest.Mock;
    };
  };
}

// Mock axios
jest.mock('axios', () => {
  const mockAxios: MockAxios = {
    create: jest.fn().mockReturnThis(),
    get: jest.fn().mockImplementation(() => Promise.resolve({ data: [] })),
    interceptors: {
      response: {
        use: jest.fn((successFn) => successFn),
      },
    },
  };
  return mockAxios;
});

// Mock console methods to prevent log pollution
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});

const mockedAxios = axios as unknown as MockAxios;

describe('restCountries API', () => {
  const mockCountryData = [
    {
      name: {
        common: 'Germany',
        official: 'Federal Republic of Germany',
        nativeName: {
          deu: {
            official: 'Bundesrepublik Deutschland',
            common: 'Deutschland',
          },
        },
      },
      capital: ['Berlin'],
      region: 'Europe',
      subregion: 'Western Europe',
      population: 83000000,
      area: 357022,
      flags: {
        png: 'https://example.com/germany.png',
        svg: 'https://example.com/germany.svg',
      },
      cca2: 'DE',
      cca3: 'DEU',
      currencies: {
        EUR: {
          name: 'Euro',
          symbol: '€',
        },
      },
      languages: {
        deu: 'German',
      },
      borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
      continents: ['Europe'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCountries', () => {
    it('should be defined', () => {
      expect(getCountries).toBeDefined();
    });

    it('should make a GET request to the correct endpoint', async () => {
      // Setup the mock
      mockedAxios.get.mockResolvedValueOnce({
        data: mockCountryData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // Act
      await getCountries();

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/all?fields=name,capital,region,subregion,population,area,flags,cca2,cca3,currencies,languages,borders,continents',
      );
    });

    it('should transform the API response correctly', async () => {
      // Setup the mock
      mockedAxios.get.mockResolvedValueOnce({
        data: mockCountryData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // Act
      const result = await getCountries();

      // Assert
      expect(result[0]).toHaveProperty('name', 'Germany');
      expect(result[0]).toHaveProperty('capital', 'Berlin');
      expect(result[0]).toHaveProperty('population', 83000000);
    });

    it('should handle invalid API response formats', async () => {
      // Setup the mock with invalid data (not an array)
      mockedAxios.get.mockResolvedValueOnce({
        data: { error: 'Invalid data' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // Act & Assert
      await expect(getCountries()).rejects.toThrow('Invalid API response format');
    });

    it('should handle empty array response', async () => {
      // Setup the mock with empty array
      mockedAxios.get.mockResolvedValueOnce({
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // Act
      const result = await getCountries();

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle network errors', async () => {
      // Setup the mock to throw a network error
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(getCountries()).rejects.toThrow('Network error');
    });
  });

  describe('getCountryByName', () => {
    it('should be defined', () => {
      expect(getCountryByName).toBeDefined();
    });

    it('should make a GET request with the correct country name', async () => {
      // Setup the mock
      mockedAxios.get.mockResolvedValueOnce({
        data: mockCountryData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // Act
      await getCountryByName('Germany');

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith('/name/Germany');
    });

    it('should transform the country data correctly', async () => {
      // Setup the mock
      mockedAxios.get.mockResolvedValueOnce({
        data: mockCountryData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // Act
      const result = await getCountryByName('Germany');

      // Assert
      expect(result).toHaveProperty('name', 'Germany');
      expect(result).toHaveProperty('capital', 'Berlin');
    });

    it('should throw an error when country is not found', async () => {
      // Mock fetch to return an empty array
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      } as Response);

      // Act & Assert
      await expect(getCountryByName('NonexistentCountry')).rejects.toThrow(
        `No country found with name: NonexistentCountry`,
      );
    });

    it('should handle network errors', async () => {
      // Setup the mock to throw a network error
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(getCountryByName('Germany')).rejects.toThrow('Network error');
    });
  });

  describe('getCountriesByContinent', () => {
    it('should be defined', () => {
      expect(getCountriesByContinent).toBeDefined();
    });

    it('should make a GET request with the correct continent', async () => {
      // Setup the mock
      mockedAxios.get.mockResolvedValueOnce({
        data: mockCountryData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // Act
      await getCountriesByContinent('Europe');

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith('/region/europe');
    });

    it('should handle empty continents gracefully', async () => {
      // Setup the mock with valid but empty response
      mockedAxios.get.mockResolvedValueOnce({
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // Act
      const result = await getCountriesByContinent('Europe');

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle network errors', async () => {
      // Setup the mock to throw a network error
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(getCountriesByContinent('Europe')).rejects.toThrow();
    });

    it('should handle invalid continent names', async () => {
      // For this test, let's make the API return an empty array instead of throwing
      // since the actual implementation might handle this by returning empty results
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      } as Response);

      // Act & Assert
      // Check that the function returns an empty array for invalid continent
      const result = await getCountriesByContinent('InvalidContinent');
      expect(result).toEqual([]);
    });
  });

  describe('getPopularCountries', () => {
    it('should be defined', () => {
      expect(getPopularCountries).toBeDefined();
    });

    it('should return a list of popular countries', async () => {
      // Setup the mock
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('/name/') || url.includes('/all')) {
          return Promise.resolve({
            data: [mockCountryData[0]],
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as any,
          });
        }
        return Promise.resolve({ data: [] });
      });

      // Act
      const result = await getPopularCountries();

      // Assert
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(8);
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      // Setup the mock to throw on some country requests
      let callCount = 0;
      mockedAxios.get.mockImplementation(() => {
        callCount++;
        if (callCount % 2 === 0) {
          return Promise.reject(new Error('API error'));
        }
        return Promise.resolve({
          data: [mockCountryData[0]],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        });
      });

      // Act
      const result = await getPopularCountries();

      // Assert - should still return some countries even with errors
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle the case when all API calls fail', async () => {
      // Setup the mock to throw on all country requests
      mockedAxios.get.mockRejectedValue(new Error('API error'));

      // Act
      const result = await getPopularCountries();

      // Assert - should return empty array
      expect(result).toEqual([]);
    });
  });
});

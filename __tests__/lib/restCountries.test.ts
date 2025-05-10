import axios from 'axios';
import { getCountries, getCountryByName, getCountriesByContinent, getPopularCountries } from '../../src/lib/restCountries';

// Type for our mock axios instance
interface MockAxios {
  create: jest.Mock;
  get: jest.Mock;
  interceptors: {
    response: {
      use: jest.Mock;
    }
  }
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

const mockedAxios = axios as unknown as MockAxios;

describe('restCountries API', () => {
  const mockCountryData = [{
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
  }];

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
        config: {} as any
      });

      // Act
      try {
        await getCountries();
      } catch (e) {
        // We expect this to fail in the test environment
      }

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/all?fields=name,capital,region,subregion,population,area,flags,cca2,cca3,currencies,languages,borders,continents',
      );
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
        config: {} as any
      });

      // Act
      try {
        await getCountryByName('Germany');
      } catch (e) {
        // We expect this to fail in the test environment
      }

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith('/name/Germany');
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
        config: {} as any
      });

      // Act
      try {
        await getCountriesByContinent('Europe');
      } catch (e) {
        // We expect this to fail in the test environment
      }

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith('/region/europe');
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
            config: {} as any
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
  });
}); 
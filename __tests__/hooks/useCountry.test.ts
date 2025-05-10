import useCountry from '../../src/hooks/useCountry';

// Mock the restCountries API
jest.mock('../../src/lib/restCountries', () => ({
  getCountryByName: jest.fn(),
}));

describe('useCountry hook', () => {
  it('should export the useCountry hook', () => {
    expect(useCountry).toBeDefined();
  });
});

import useCountries, { useCountriesByContinent } from '../../src/hooks/useCountries';

// Mock the restCountries API
jest.mock('../../src/lib/restCountries', () => ({
  getCountries: jest.fn(),
  getCountriesByContinent: jest.fn(),
}));

describe('useCountries hooks', () => {
  it('should export the useCountries hook', () => {
    expect(useCountries).toBeDefined();
  });

  it('should export the useCountriesByContinent hook', () => {
    expect(useCountriesByContinent).toBeDefined();
  });
});

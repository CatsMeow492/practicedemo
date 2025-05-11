import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountriesGrid from '../../src/components/CountriesGrid';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as useCountriesHooks from '../../src/hooks/useCountries';

// Mock the hooks from useCountries
jest.mock('../../src/hooks/useCountries', () => ({
  __esModule: true,
  default: jest.fn(),
  useCountriesByContinent: jest.fn(),
}));

// Mock CountryCard component
jest.mock('../../src/components/CountryCard', () => {
  return function MockCountryCard({ country }: { country: any }) {
    return <div data-testid={`country-card-${country.alpha3Code}`}>{country.name}</div>;
  };
});

// Sample country data for testing
const mockCountries = [
  {
    name: 'Germany',
    alpha3Code: 'DEU',
    capital: 'Berlin',
    population: 83000000,
    region: 'Europe',
    flags: { png: 'https://example.com/germany.png' },
  },
  {
    name: 'France',
    alpha3Code: 'FRA',
    capital: 'Paris',
    population: 67000000,
    region: 'Europe',
    flags: { png: 'https://example.com/france.png' },
  },
  {
    name: 'Japan',
    alpha3Code: 'JPN',
    capital: 'Tokyo',
    population: 126000000,
    region: 'Asia',
    flags: { png: 'https://example.com/japan.png' },
  },
];

// Setup function to create a wrapper with React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Add display name to the component
  const Wrapper: React.FC<React.PropsWithChildren<object>> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryWrapper';

  return Wrapper;
};

describe('CountriesGrid Component', () => {
  const useCountriesMock = useCountriesHooks.default as jest.Mock;
  const useCountriesByContinentMock = useCountriesHooks.useCountriesByContinent as jest.Mock;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Default implementation for the hooks
    useCountriesMock.mockReturnValue({
      data: mockCountries,
      isLoading: false,
      isError: false,
      error: null,
    });

    useCountriesByContinentMock.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it('should render the component with loaded countries', () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <CountriesGrid />
      </Wrapper>,
    );

    // Check if country cards are rendered
    expect(screen.getByTestId('country-card-DEU')).toBeInTheDocument();
    expect(screen.getByTestId('country-card-FRA')).toBeInTheDocument();
    expect(screen.getByTestId('country-card-JPN')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    useCountriesMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <CountriesGrid />
      </Wrapper>,
    );

    expect(screen.getByText('Loading countries...')).toBeInTheDocument();
  });

  it('should display error state', () => {
    const mockError = new Error('Failed to fetch countries');
    useCountriesMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    });

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <CountriesGrid />
      </Wrapper>,
    );

    expect(screen.getByText(/Error loading countries/)).toBeInTheDocument();
  });

  it('should filter countries by search query', () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <CountriesGrid />
      </Wrapper>,
    );

    // Enter search query
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'ger' } });

    // Germany should be visible, France should not
    expect(screen.getByTestId('country-card-DEU')).toBeInTheDocument();
    expect(screen.queryByTestId('country-card-FRA')).not.toBeInTheDocument();
  });

  it('should filter countries by continent', async () => {
    // Set up the continent filter to return European countries
    useCountriesByContinentMock.mockReturnValue({
      data: mockCountries.filter((c) => c.region === 'Europe'),
      isLoading: false,
      isError: false,
      error: null,
    });

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <CountriesGrid />
      </Wrapper>,
    );

    // Select Europe from dropdown
    const continentSelect = screen.getByRole('combobox');
    fireEvent.change(continentSelect, { target: { value: 'europe' } });

    // Only European countries should be visible
    await waitFor(() => {
      expect(screen.getByTestId('country-card-DEU')).toBeInTheDocument();
      expect(screen.getByTestId('country-card-FRA')).toBeInTheDocument();
      expect(screen.queryByTestId('country-card-JPN')).not.toBeInTheDocument();
    });

    // Verify the hook was called with the right continent
    expect(useCountriesByContinentMock).toHaveBeenCalledWith('europe');
  });

  it('should show no results message when search has no matches', () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <CountriesGrid />
      </Wrapper>,
    );

    // Enter search query that won't match any country
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'xyz' } });

    // No country cards should be visible
    expect(screen.queryByTestId('country-card-DEU')).not.toBeInTheDocument();
    expect(screen.queryByTestId('country-card-FRA')).not.toBeInTheDocument();
    expect(screen.queryByTestId('country-card-JPN')).not.toBeInTheDocument();

    // No results message should be displayed
    expect(screen.getByText('No countries found matching your criteria.')).toBeInTheDocument();
  });

  it('should render with initialCountries if provided', () => {
    const initialCountries = [
      {
        name: 'Brazil',
        alpha3Code: 'BRA',
        alpha2Code: 'BR',
        capital: 'Brasilia',
        population: 212000000,
        region: 'Americas',
        continents: ['South America'],
        flags: {
          png: 'https://example.com/brazil.png',
          svg: 'https://example.com/brazil.svg',
        },
      },
    ];

    // For this test, let's mock the useCountries hook to return undefined data
    // This better matches how the component will behave with initialCountries
    useCountriesMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    });

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <CountriesGrid initialCountries={initialCountries} />
      </Wrapper>,
    );

    // Debug what's rendered in the component
    // screen.debug();

    // The initialCountries should be visible
    expect(screen.getByTestId('country-card-BRA')).toBeInTheDocument();
  });
});

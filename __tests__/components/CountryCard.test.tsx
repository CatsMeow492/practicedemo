import React from 'react';
import { render, screen } from '@testing-library/react';
import CountryCard from '../../src/components/CountryCard';
import { Country } from '../../src/lib/restCountries';

// Mock the AccessibleImage component
jest.mock('../../src/components/AccessibleImage', () => {
  return function MockAccessibleImage({ alt }: { alt: string }) {
    return <img alt={alt} data-testid="mock-accessible-image" />;
  };
});

describe('CountryCard', () => {
  const mockCountry: Country = {
    name: 'Germany',
    alpha2Code: 'DE',
    alpha3Code: 'DEU',
    capital: 'Berlin',
    region: 'Europe',
    subregion: 'Western Europe',
    population: 83000000,
    area: 357022,
    flags: {
      png: 'https://example.com/germany.png',
      svg: 'https://example.com/germany.svg',
    },
    currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    languages: [{ name: 'German', nativeName: 'de' }],
    borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
    continents: ['Europe'],
  };

  it('renders country information correctly', () => {
    render(<CountryCard country={mockCountry} />);
    
    // Check that country name is displayed
    expect(screen.getByText('Germany')).toBeInTheDocument();
    
    // Check that population is displayed with correct formatting
    expect(screen.getByText('Population:')).toBeInTheDocument();
    expect(screen.getByText('83,000,000', { exact: false })).toBeInTheDocument();
    
    // Check that region is displayed
    expect(screen.getByText('Region:')).toBeInTheDocument();
    expect(screen.getByText('Europe', { exact: false })).toBeInTheDocument();
    
    // Check that capital is displayed
    expect(screen.getByText('Capital:')).toBeInTheDocument();
    expect(screen.getByText('Berlin', { exact: false })).toBeInTheDocument();

    // Check that flag image is rendered with correct alt text
    const flagElement = screen.getByTestId('mock-accessible-image');
    expect(flagElement).toHaveAttribute('alt', 'Flag of Germany');
  });

  it('renders country without capital correctly', () => {
    const countryWithoutCapital = { ...mockCountry, capital: undefined };
    render(<CountryCard country={countryWithoutCapital} />);
    
    // Check that capital section is not displayed
    expect(screen.queryByText('Capital:')).not.toBeInTheDocument();
  });

  it('uses correct flag URL', () => {
    render(<CountryCard country={mockCountry} />);
    
    // The component should use the proxy route for the flag
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/country/de');
  });
}); 
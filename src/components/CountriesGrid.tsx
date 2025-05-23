'use client';

import { useState, useEffect } from 'react';
import CountryCard from './CountryCard';
import useCountries, { useCountriesByContinent } from '../hooks/useCountries';
import type { Country } from '../lib/restCountries';

interface CountriesGridProps {
  initialCountries?: Country[];
}

export default function CountriesGrid({ initialCountries = [] }: CountriesGridProps) {
  const [continent, setContinent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  // Unused variable commented out
  // const [debugInfo, setDebugInfo] = useState<string>('');

  // Call hooks unconditionally (React hooks rule)
  const {
    data: countriesAll = initialCountries,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    // Unused variables commented out
    // status,
    // fetchStatus,
  } = useCountries();

  const {
    data: countriesByContinent = [],
    isLoading: isLoadingContinent,
    isError: isErrorContinent,
    error: errorContinent,
  } = useCountriesByContinent(continent);

  // Determine which data to use based on continent selection
  const countries = continent ? countriesByContinent : countriesAll;
  const isLoading = continent ? isLoadingContinent : isLoadingAll;
  const isError = continent ? isErrorContinent : isErrorAll;
  const error = continent ? errorContinent : errorAll;

  // Add debugging effect to log any errors
  useEffect(() => {
    if (isError) {
      console.error('API Error:', error);
      if (error instanceof Error) {
        setApiError(error.message);
        // Set debug info with appropriate type handling
        setApiError(`Stack: ${error.stack || 'No stack trace'}`);
      } else {
        setApiError('Unknown error type');
        // Set debug info with appropriate type handling
        setApiError(JSON.stringify(error));
      }
    }
  }, [isError, error]);

  // Filter countries by search query
  const filteredCountries =
    (Array.isArray(countries) ? countries : []).filter((country: Country) =>
      country?.name?.toLowerCase?.().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <div className="countries-grid">
      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search for a country..."
          className="p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 dark:text-white dark:bg-gray-700 flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 dark:text-white dark:bg-gray-700 w-full md:w-64"
          value={continent}
          onChange={(e) => setContinent(e.target.value)}
        >
          <option value="">Filter by Region</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="oceania">Oceania</option>
        </select>
      </div>

      {/* Loading state */}
      {isLoading && initialCountries.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg">Loading countries...</p>
        </div>
      )}

      {/* Error state with more details */}
      {isError && (
        <div className="text-center py-10 text-red-500">
          <p className="text-lg">Error loading countries: {apiError}</p>
          <p className="mt-2 text-sm">Check browser console for more details.</p>
        </div>
      )}

      {/* No results */}
      {!isLoading && !isError && filteredCountries.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg">No countries found matching your criteria.</p>
        </div>
      )}

      {/* Countries grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCountries.map((country: Country) => (
          <CountryCard key={country.alpha3Code} country={country} />
        ))}
      </div>
    </div>
  );
}

/**
 * Country detail page
 */
'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import restCountriesApi from '../../../src/lib/restCountries';
import type { Country } from '../../../src/lib/restCountries';

interface CountryDetailPageProps {
  params: {
    code: string;
  };
}

export default function CountryDetailPage({ params }: CountryDetailPageProps) {
  const { code } = params;
  const [borderCountries, setBorderCountries] = useState<Country[]>([]);

  // Fetch country by alpha2Code
  const { 
    data: country,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['country', code],
    queryFn: async () => {
      // For this demo, we'll fetch all countries and find the one with matching code
      // In a real app, we would use a direct API endpoint for getting country by code
      const countries = await restCountriesApi.getCountries();
      const foundCountry = countries.find((c: any) => 
        c.alpha2Code.toLowerCase() === code.toLowerCase() || 
        c.alpha3Code.toLowerCase() === code.toLowerCase()
      );
      
      if (!foundCountry) {
        throw new Error('Country not found');
      }
      
      return foundCountry;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch border countries
  useEffect(() => {
    if (country?.borders && country.borders.length > 0) {
      const fetchBorderCountries = async () => {
        try {
          const allCountries = await restCountriesApi.getCountries();
          const borders = allCountries.filter((c: any) => 
            country.borders?.includes(c.alpha3Code)
          );
          setBorderCountries(borders);
        } catch (error) {
          console.error('Error fetching border countries:', error);
        }
      };
      
      fetchBorderCountries();
    }
  }, [country]);

  // Debug info for testing
  const apiStatus = isLoading ? 'Loading' : isError ? 'Error' : 'Success';

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-lg">Loading country information...</p>
        <p className="mt-2 text-sm">API Status: {apiStatus}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        <p className="text-lg">Error: {error instanceof Error ? error.message : 'Failed to load country'}</p>
        <p className="mt-2 text-sm">API Status: {apiStatus}</p>
        <Link href="/" className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="text-center py-10">
        <p className="text-lg">Country not found</p>
        <p className="mt-2 text-sm">API Status: {apiStatus}</p>
        <Link href="/" className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Debug info */}
      <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
        <p>API Status: {apiStatus}</p>
        <p>Country: {country.name}</p>
      </div>
      
      <Link 
        href="/" 
        className="inline-flex items-center px-6 py-3 bg-surface-elevated shadow-md rounded mb-10 hover:shadow-lg transition-shadow"
      >
        <span className="mr-2">←</span> Back
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Flag */}
        <div className="relative w-full aspect-[4/3] shadow-lg">
          <Image
            src={country.flags.svg || country.flags.png}
            alt={`Flag of ${country.name}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Country details */}
        <div>
          <h1 className="text-3xl font-bold mb-6">{country.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
            <div>
              {country.capital && (
                <p><span className="font-semibold">Capital:</span> {country.capital}</p>
              )}
              <p><span className="font-semibold">Region:</span> {country.region}</p>
              {country.subregion && (
                <p><span className="font-semibold">Sub Region:</span> {country.subregion}</p>
              )}
              <p><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
            </div>
            
            <div>
              {country.area && (
                <p><span className="font-semibold">Area:</span> {country.area.toLocaleString()} km²</p>
              )}
              {country.currencies && country.currencies.length > 0 && (
                <p>
                  <span className="font-semibold">Currencies:</span>{' '}
                  {country.currencies.map((c: any) => `${c.name} (${c.symbol || c.code})`).join(', ')}
                </p>
              )}
              {country.languages && country.languages.length > 0 && (
                <p>
                  <span className="font-semibold">Languages:</span>{' '}
                  {country.languages.map((l: any) => l.name).join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Border countries */}
          {country.borders && country.borders.length > 0 && (
            <div className="mt-8">
              <p className="font-semibold mb-3">Border Countries:</p>
              <div className="flex flex-wrap gap-2">
                {borderCountries.map((border: any) => (
                  <Link 
                    key={border.alpha3Code}
                    href={`/country/${border.alpha2Code.toLowerCase()}`}
                    className="px-6 py-2 bg-surface-elevated shadow-sm rounded text-sm hover:shadow-md transition-shadow"
                  >
                    {border.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
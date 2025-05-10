/**
 * React Query hook for fetching a specific country by name
 */
import { useQuery } from '@tanstack/react-query';
import restCountriesApi from '../lib/restCountries';
import type { Country } from '../lib/restCountries';
import { QUERY_KEY as COUNTRIES_QUERY_KEY } from './useCountries';

export default function useCountry(countryName: string) {
  return useQuery<Country, Error>({
    queryKey: [...COUNTRIES_QUERY_KEY, countryName],
    queryFn: () => restCountriesApi.getCountryByName(countryName),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (changed from cacheTime)
    enabled: !!countryName, // Only run query if country name is provided
  });
}

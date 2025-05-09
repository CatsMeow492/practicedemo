/**
 * React Query hook for fetching all countries
 */
import { useQuery } from '@tanstack/react-query';
import restCountriesApi from '../lib/restCountries';
import type { Country } from '../lib/restCountries';

export const QUERY_KEY = ['countries'];

export default function useCountries() {
  return useQuery<Country[], Error>({
    queryKey: QUERY_KEY,
    queryFn: () => restCountriesApi.getCountries(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Additional hook for filtering countries by continent
export function useCountriesByContinent(continent: string) {
  return useQuery<Country[], Error>({
    queryKey: [...QUERY_KEY, 'continent', continent],
    queryFn: () => restCountriesApi.getCountriesByContinent(continent),
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    enabled: !!continent, // Only run query if continent is provided
  });
}

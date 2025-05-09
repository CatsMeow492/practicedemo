/**
 * REST Countries API Client
 * Based on: https://restcountries.com/ API v3
 */
import axios from 'axios';
import { z } from 'zod';

// Base API configuration
const API_BASE_URL = 'https://restcountries.com/v3.1';

// Create a configured Axios instance with timeout
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 15000, // Increased to 15 second timeout
});

// Add a response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API call success: ${response.config.url} (Status: ${response.status})`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    console.error(`API call failed: ${url} (Status: ${status || 'Network Error'})`);
    console.error(error.message);
    return Promise.reject(error);
  }
);

// Zod schemas for response validation with more relaxed validation
export const CountrySchema = z.object({
  name: z.object({
    common: z.string(),
    official: z.string(),
    nativeName: z.record(z.string(), z.object({
      official: z.string(),
      common: z.string(),
    })).optional().nullable(),
  }),
  capital: z.array(z.string()).optional().nullable(),
  region: z.string(),
  subregion: z.string().optional().nullable(),
  population: z.number(),
  area: z.number().optional().nullable(),
  flags: z.object({
    png: z.string().url(),
    svg: z.string().url(),
  }),
  cca2: z.string(),
  cca3: z.string(),
  currencies: z.record(z.string(), z.object({
    name: z.string(),
    symbol: z.string().optional().nullable(),
  })).optional().nullable(),
  languages: z.record(z.string(), z.string()).optional().nullable(),
  borders: z.array(z.string()).optional().nullable(),
  continents: z.array(z.string()),
});

// Define types based on the schema
export type CountryRaw = z.infer<typeof CountrySchema>;
export type CountriesResponse = CountryRaw[];

// Transformed Country type for use in the application
export type Country = {
  name: string;
  capital?: string;
  region: string;
  subregion?: string;
  population: number;
  area?: number;
  flags: {
    png: string;
    svg: string;
  };
  alpha2Code: string;
  alpha3Code: string;
  currencies?: Array<{
    code: string;
    name: string;
    symbol?: string;
  }>;
  languages?: Array<{
    name: string;
    nativeName?: string;
  }>;
  borders?: string[];
  continents: string[];
};

// Transform countries from API format to application format
const transformCountry = (country: CountryRaw): Country => {
  try {
    return {
      name: country.name.common,
      capital: country.capital ? country.capital[0] : undefined,
      region: country.region,
      subregion: country.subregion || undefined,
      population: country.population,
      area: country.area || undefined,
      flags: country.flags,
      alpha2Code: country.cca2,
      alpha3Code: country.cca3,
      currencies: country.currencies 
        ? Object.entries(country.currencies).map(([code, currency]) => ({
            code,
            name: currency.name,
            symbol: currency.symbol || undefined
          }))
        : undefined,
      languages: country.languages 
        ? Object.entries(country.languages).map(([code, name]) => ({
            name,
            nativeName: code
          }))
        : undefined,
      borders: country.borders || undefined,
      continents: country.continents,
    };
  } catch (error) {
    console.error('Error transforming country:', error);
    console.error('Problem with country object:', JSON.stringify(country, null, 2));
    throw new Error(`Failed to transform country data: ${(error as Error).message}`);
  }
};

// API functions
export const getCountries = async (): Promise<Country[]> => {
  console.log('getCountries API call initiated');
  try {
    // Use fields parameter to get a subset of fields for better performance
    const response = await apiClient.get('/all?fields=name,capital,region,subregion,population,area,flags,cca2,cca3,currencies,languages,borders,continents');
    console.log('API response received with', response.data?.length || 0, 'countries');
    
    if (!response.data || !Array.isArray(response.data)) {
      console.error('Invalid API response format:', response.data);
      throw new Error('Invalid API response format - expected array');
    }
    
    if (response.data.length === 0) {
      console.warn('API returned empty array of countries');
      return [];
    }
    
    // Log first country for debugging
    if (response.data.length > 0) {
      console.log('First country sample:', JSON.stringify(response.data[0], null, 2));
    }
    
    // Validate response data
    try {
      console.log('Validating response data with Zod...');
      const countries = z.array(CountrySchema).parse(response.data);
      console.log('Zod validation successful');
      
      // Transform data
      console.log('Transforming country data...');
      const transformed = countries.map(transformCountry);
      console.log('Transformation complete. Returning', transformed.length, 'countries');
      return transformed;
    } catch (validationError) {
      console.error('Zod validation error:', validationError);
      if (validationError instanceof z.ZodError) {
        console.error('Validation issues:', JSON.stringify(validationError.issues, null, 2));
        // Try to continue with partial data if possible
        console.warn('Attempting to recover and transform as many valid countries as possible...');
        return response.data
          .filter((country: any) => country && typeof country === 'object')
          .map((country: any) => {
            try {
              return transformCountry(CountrySchema.parse(country));
            } catch (e) {
              console.warn('Skipped invalid country:', country?.name?.common || 'unknown');
              return null;
            }
          })
          .filter((country): country is Country => country !== null);
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

/**
 * Get a list of the most populated countries for pre-rendering
 * This function is used for server-side rendering (SSR) and static generation
 */
export const getPopularCountries = async (): Promise<Country[]> => {
  console.log('Fetching popular countries for pre-rendering');
  try {
    // Get all countries
    const countries = await getCountries();
    
    // Sort by population (descending) and take top 8
    const popularCountries = [...countries]
      .sort((a, b) => b.population - a.population)
      .slice(0, 8);
    
    console.log(`Pre-rendering ${popularCountries.length} popular countries`);
    
    return popularCountries;
  } catch (error) {
    console.error('Error fetching popular countries:', error);
    // Return an empty array instead of throwing, so the page can still render
    return [];
  }
};

export const getCountryByName = async (name: string): Promise<Country> => {
  try {
    console.log(`getCountryByName API call for "${name}"`);
    const response = await apiClient.get(`/name/${encodeURIComponent(name)}`);
    
    // Validate response data (returns an array)
    const countries = z.array(CountrySchema).parse(response.data);
    
    if (countries.length === 0) {
      throw new Error(`No country found with name: ${name}`);
    }
    
    // Return the first result
    return transformCountry(countries[0]);
  } catch (error) {
    console.error(`Error fetching country by name (${name}):`, error);
    throw error;
  }
};

export const getCountriesByContinent = async (continent: string): Promise<Country[]> => {
  try {
    console.log(`getCountriesByContinent API call for "${continent}"`);
    const response = await apiClient.get(`/region/${encodeURIComponent(continent.toLowerCase())}`);
    
    // Validate response data
    const countries = z.array(CountrySchema).parse(response.data);
    console.log(`Found ${countries.length} countries in ${continent}`);
    
    // Transform data
    return countries.map(transformCountry);
  } catch (error) {
    console.error(`Error fetching countries by continent (${continent}):`, error);
    throw error;
  }
};

// Default export
const restCountriesApi = {
  getCountries,
  getCountryByName,
  getCountriesByContinent,
  getPopularCountries
};

export default restCountriesApi; 
/**
 * Country detail page
 */
import React from 'react';
import Link from 'next/link';
import restCountriesApi from '../../../src/lib/restCountries';
import type { Country } from '../../../src/lib/restCountries';
import AccessibleImage from '../../../src/components/AccessibleImage';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Define the props for generateMetadata
interface PageProps {
  params: { code: string };
}

// Generate dynamic metadata for SEO
export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  try {
    const countries = await restCountriesApi.getCountries();
    const country = countries.find(
      (c) =>
        c.alpha2Code.toLowerCase() === params.code.toLowerCase() ||
        c.alpha3Code.toLowerCase() === params.code.toLowerCase(),
    );

    if (!country) {
      return {
        title: 'Country Not Found',
        description: 'The requested country could not be found.',
      };
    }

    return {
      title: country.name,
      description: `Learn about ${country.name}: population, capital, region, languages, and more.`,
      openGraph: {
        title: `${country.name} | Countries Dashboard`,
        description: `Information about ${country.name} including capital, population, region, and more.`,
        images: [
          {
            url: country.flags.png,
            width: 800,
            height: 600,
            alt: `Flag of ${country.name}`,
          },
        ],
      },
    };
  } catch {
    return {
      title: 'Country Details',
      description: 'Information about a country.',
    };
  }
}

// Use static paths to pre-render the most popular countries
export async function generateStaticParams() {
  try {
    // Get the most popular countries for pre-rendering
    const popularCountries = await restCountriesApi.getPopularCountries();
    return popularCountries.map((country) => ({
      code: country.alpha2Code.toLowerCase(),
    }));
  } catch (error) {
    console.error('Error generating static paths:', error);
    return [];
  }
}

export default async function CountryDetailPage({ params }: PageProps) {
  const { code } = params;

  try {
    // Fetch country data
    const countries = await restCountriesApi.getCountries();
    const country = countries.find(
      (c) =>
        c.alpha2Code.toLowerCase() === code.toLowerCase() ||
        c.alpha3Code.toLowerCase() === code.toLowerCase(),
    );

    if (!country) {
      notFound();
    }

    // Fetch border countries
    let borderCountries: Country[] = [];
    if (country.borders && country.borders.length > 0) {
      borderCountries = countries.filter((c) => country.borders?.includes(c.alpha3Code));
    }

    // Use the optimized flag image URL from our internal API route
    const optimizedFlagUrl = `/flags?url=${encodeURIComponent(
      country.flags.svg || country.flags.png,
    )}`;

    return (
      <div className="container mx-auto py-8 px-4">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-surface-elevated shadow-md rounded mb-10 hover:shadow-lg transition-shadow"
          aria-label="Return to countries list"
        >
          <span className="mr-2" aria-hidden="true">
            ←
          </span>{' '}
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Flag */}
          <div className="relative w-full aspect-[4/3] shadow-lg">
            <AccessibleImage
              src={optimizedFlagUrl}
              alt={`Flag of ${country.name}`}
              fill
              className="w-full h-full"
              imgClassName="object-cover"
              priority={true}
              showLoadingIndicator={true}
            />
          </div>

          {/* Country details */}
          <div>
            <h1
              className="text-3xl font-bold mb-6"
              lang={
                country.languages?.[0]?.nativeName ? country.languages[0].nativeName : undefined
              }
            >
              {country.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
              <div>
                {country.capital && (
                  <p>
                    <span className="font-semibold">Capital:</span> {country.capital}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Region:</span> {country.region}
                </p>
                {country.subregion && (
                  <p>
                    <span className="font-semibold">Sub Region:</span> {country.subregion}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Population:</span>{' '}
                  {country.population.toLocaleString()}
                </p>
              </div>

              <div>
                {country.area && (
                  <p>
                    <span className="font-semibold">Area:</span> {country.area.toLocaleString()} km²
                  </p>
                )}
                {country.currencies && country.currencies.length > 0 && (
                  <p>
                    <span className="font-semibold">Currencies:</span>{' '}
                    {country.currencies.map((c) => `${c.name} (${c.symbol || c.code})`).join(', ')}
                  </p>
                )}
                {country.languages && country.languages.length > 0 && (
                  <p>
                    <span className="font-semibold">Languages:</span>{' '}
                    {country.languages.map((l, i) => (
                      <React.Fragment key={l.name}>
                        {i > 0 && ', '}
                        <span lang={l.nativeName || undefined}>{l.name}</span>
                      </React.Fragment>
                    ))}
                  </p>
                )}
              </div>
            </div>

            {/* Border countries */}
            {borderCountries.length > 0 && (
              <div className="mt-8">
                <h2 className="font-semibold mb-3">Border Countries:</h2>
                <ul className="flex flex-wrap gap-2" aria-label="Border countries">
                  {borderCountries.map((border) => (
                    <li key={border.alpha3Code}>
                      <Link
                        href={`/country/${border.alpha2Code.toLowerCase()}`}
                        className="px-6 py-2 bg-surface-elevated shadow-sm rounded text-sm hover:shadow-md transition-shadow"
                        aria-label={`View details for ${border.name}`}
                      >
                        {border.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching country:', error);
    return (
      <div className="container mx-auto py-8 px-4">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-surface-elevated shadow-md rounded mb-10 hover:shadow-lg transition-shadow"
          aria-label="Return to home page"
        >
          <span className="mr-2">←</span> Back
        </Link>

        <div className="text-center py-10 text-red-500" role="alert" aria-live="assertive">
          <p className="text-lg">Error loading country details</p>
          <p className="mt-2 text-sm">Please try again later</p>
        </div>
      </div>
    );
  }
}

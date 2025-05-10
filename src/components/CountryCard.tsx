/**
 * CountryCard component for displaying country information
 */
import React from 'react';
import Link from 'next/link';
import type { Country } from '../lib/restCountries';
import AccessibleImage from './AccessibleImage';

interface CountryCardProps {
  country: Country;
}

export default function CountryCard({ country }: CountryCardProps) {
  // Use direct flag URL in production for testing
  // This bypasses our proxy route to see if that's the issue
  const isProduction = process.env.NODE_ENV === 'production';
  const flagUrl = country.flags.png || country.flags.svg;
  const optimizedFlagUrl = isProduction 
    ? flagUrl  // Use direct URL in production 
    : `/flags?url=${encodeURIComponent(flagUrl)}`; // Use proxy in development

  return (
    <Link
      href={`/country/${country.alpha2Code.toLowerCase()}`}
      className="block bg-surface-elevated rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-40 w-full">
        <AccessibleImage
          src={optimizedFlagUrl}
          alt={`Flag of ${country.name}`}
          fill
          imgClassName="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          showLoadingIndicator={true}
        />
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold text-primary mb-2">{country.name}</h2>

        <div className="space-y-1 text-text">
          <p>
            <span className="font-semibold">Population:</span> {country.population.toLocaleString()}
          </p>

          <p>
            <span className="font-semibold">Region:</span> {country.region}
          </p>

          {country.capital && (
            <p>
              <span className="font-semibold">Capital:</span> {country.capital}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

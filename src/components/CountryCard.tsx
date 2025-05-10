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
  // Always use the proxy route for flag images
  const flagUrl = country.flags.png || country.flags.svg;
  const optimizedFlagUrl = `/flags?url=${encodeURIComponent(flagUrl)}`;

  return (
    <Link
      href={`/country/${country.alpha2Code.toLowerCase()}`}
      className="block bg-surface-elevated rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-40 w-full waving-flag-container">
        <AccessibleImage
          src={optimizedFlagUrl}
          alt={`Flag of ${country.name}`}
          fill
          imgClassName="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          showLoadingIndicator={true}
        />
        <div className="waving-flag-overlay"></div>
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

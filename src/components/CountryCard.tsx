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
  // Use the optimized flag image URL from our internal API route
  const optimizedFlagUrl = `/flags?url=${encodeURIComponent(country.flags.png)}`;
  
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
          className="object-cover"
          loading="lazy"
          showLoadingIndicator={true}
        />
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-bold text-primary mb-2">{country.name}</h2>
        
        <div className="space-y-1 text-text">
          <p>
            <span className="font-semibold">Population:</span>{' '}
            {country.population.toLocaleString()}
          </p>
          
          <p>
            <span className="font-semibold">Region:</span>{' '}
            {country.region}
          </p>
          
          {country.capital && (
            <p>
              <span className="font-semibold">Capital:</span>{' '}
              {country.capital}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
} 
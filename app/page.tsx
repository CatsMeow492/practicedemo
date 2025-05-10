/**
 * Home page component with countries grid
 * This uses React Server Components to pre-render the popular countries
 */

import { Suspense } from 'react';
import { getPopularCountries } from '../src/lib/restCountries';
import CountriesGrid from '../src/components/CountriesGrid';

export const metadata = {
  title: 'Countries Dashboard',
  description:
    'Explore global country data with ease. Find information about countries around the world.',
};

export default async function HomePage() {
  // Pre-render popular countries at build time
  const popularCountries = await getPopularCountries();

  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<div className="text-center py-10">Loading countries data...</div>}>
        <CountriesGrid initialCountries={popularCountries} />
      </Suspense>
    </div>
  );
}

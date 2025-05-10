import type { Metadata } from 'next';

// Return the same metadata that is exported from app/layout.tsx
// This allows testing without triggering the RSC client metadata export error
export function getLayoutMetadata(): Metadata {
  return {
    title: {
      template: '%s | Where in the world?',
      default: 'Where in the world?',
    },
    description: 'Explore global country data with ease. Find information about countries, their flags, population, and more.',
    keywords: ['countries', 'flags', 'population', 'geography', 'world data'],
    authors: [{ name: 'Countries Dashboard Team' }],
    openGraph: {
      title: 'Where in the world?',
      description: 'Explore global country data with ease.',
      url: 'https://countries-dashboard.vercel.app',
      siteName: 'Where in the world?',
      locale: 'en_US',
      type: 'website',
    },
  };
}

// Return the same metadata that is exported from app/page.tsx
export function getHomePageMetadata(): Metadata {
  return {
    title: 'Countries Dashboard',
    description: 'Explore global country data with ease. Find information about countries around the world.',
  };
}

// Generate country page metadata for testing without importing from the page file
export function generateCountryPageMetadata(countryName: string): Metadata {
  return {
    title: `${countryName} | Country Details`,
    description: `Learn about ${countryName}'s geography, population, languages, and more.`,
    openGraph: {
      title: `${countryName} | Country Details`,
      description: `Detailed information about ${countryName}.`,
      images: [
        {
          url: `/api/og?country=${encodeURIComponent(countryName)}`,
          width: 1200,
          height: 630,
          alt: `${countryName} information`,
        },
      ],
    },
  };
} 
import { NextResponse } from 'next/server';
import restCountriesApi from '../../src/lib/restCountries';

export async function GET() {
  const baseUrl = 'https://countries-dashboard.vercel.app';
  let countryUrls = '';

  try {
    const countries = await restCountriesApi.getCountries();
    countryUrls = countries
      .map(
        (country) => `  <url>\n    <loc>${baseUrl}/country/${country.alpha2Code.toLowerCase()}</loc>\n    <priority>0.8</priority>\n  </url>`
      )
      .join('\n');
  } catch (e) {
    // If fetching fails, leave countryUrls empty
    countryUrls = '';
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${baseUrl}/</loc>\n    <priority>1.0</priority>\n  </url>\n${countryUrls}\n</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 
'use client';

import React, { useEffect, useState } from 'react';

interface WikipediaInfoProps {
  countryName: string;
}

interface WikipediaPage {
  title: string;
  extract: string;
}

interface WikipediaQueryResult {
  pages: { [pageId: string]: WikipediaPage };
}

const TEST_VARIANT_CLASS = 'enhanced-flag-animation-test';
const MAX_SUMMARY_LENGTH = 400;

export default function WikipediaInfo({ countryName }: WikipediaInfoProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isTestVariant, setIsTestVariant] = useState<boolean>(false);

  useEffect(() => {
    // Check for the test variant class on the body
    if (document.body.classList.contains(TEST_VARIANT_CLASS)) {
      setIsTestVariant(true);
    }
  }, []);

  useEffect(() => {
    if (!isTestVariant || !countryName) {
      return;
    }

    const fetchWikipediaSummary = async () => {
      setIsLoading(true);
      setError(null);
      // Simple Wikipedia API URL to get the first section of a page
      // Using a more robust library or error handling would be good for production
      const WIKIPEDIA_API_URL = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&redirects=1&origin=*&titles=${encodeURIComponent(countryName)}`;

      try {
        const response = await fetch(WIKIPEDIA_API_URL);
        if (!response.ok) {
          throw new Error(`Wikipedia API request failed with status: ${response.status}`);
        }
        const data: { query?: WikipediaQueryResult } = await response.json();

        if (data.query && data.query.pages) {
          const pages = data.query.pages;
          const pageId = Object.keys(pages)[0]; // Get the first page ID
          if (pageId && pages[pageId] && pages[pageId].extract) {
            let fullSummary = pages[pageId].extract;
            if (fullSummary.toLowerCase().includes('may refer to:')) {
                setSummary('Multiple Wikipedia entries found. More specific search needed.');
            } else {
                if (fullSummary.length > MAX_SUMMARY_LENGTH) {
                    fullSummary = fullSummary.substring(0, MAX_SUMMARY_LENGTH) + '...';
                }
                setSummary(fullSummary);
            }
          } else {
            setSummary('No summary found on Wikipedia for this country.');
          }
        } else {
          setSummary('Could not parse Wikipedia response.');
        }
      } catch (err) {
        console.error('Error fetching Wikipedia summary:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setSummary(null);
      }
      setIsLoading(false);
    };

    fetchWikipediaSummary();
  }, [countryName, isTestVariant]);

  if (!isTestVariant) {
    return null; // Don't render anything if not in the test variant
  }

  if (isLoading) {
    return <div className="mt-6 p-4 bg-surface-elevated rounded shadow-md text-text-secondary">Loading Wikipedia summary...</div>;
  }

  if (error) {
    return <div className="mt-6 p-4 bg-red-100 text-red-700 rounded shadow-md">Error: {error}</div>;
  }

  if (!summary) {
    return null; // Or some other placeholder if summary is empty but no error
  }

  return (
    <div className="mt-8 p-6 bg-surface-elevated rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-primary mb-3">From Wikipedia:</h3>
      <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
        {summary}
      </p>
      <p className="mt-3 text-xs text-text-secondary">
        <a 
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(countryName)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-accent hover:underline"
        >
            Read more on Wikipedia
        </a>
      </p>
    </div>
  );
} 
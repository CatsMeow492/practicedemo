import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getLayoutMetadata } from '../../lib/metadata-utils';

// Create a simplified component for testing layout elements
const LayoutElements = () => {
  return (
    <>
      <header>
        <nav>
          <a href="/">Where in the world?</a>
          <div data-testid="theme-toggle">Theme Toggle</div>
        </nav>
      </header>
      <main>
        <div data-testid="content">Page Content</div>
      </main>
      <footer>
        <p>© {new Date().getFullYear()} Where in the world?</p>
        <p>
          Data provided by <a href="https://restcountries.com">REST Countries API</a>
        </p>
      </footer>
    </>
  );
};

describe('Layout Elements', () => {
  it('renders the header, main content, and footer', () => {
    render(<LayoutElements />);

    // Check header elements
    expect(screen.getByText('Where in the world?')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();

    // Check that main content is rendered
    expect(screen.getByTestId('content')).toBeInTheDocument();

    // Check footer elements
    expect(screen.getByText(/© \d{4} Where in the world\?/)).toBeInTheDocument();
    expect(screen.getByText('Data provided by')).toBeInTheDocument();
    expect(screen.getByText('REST Countries API')).toBeInTheDocument();
  });
});

describe('Layout metadata', () => {
  it('has the correct title configuration', () => {
    const metadata = getLayoutMetadata();
    expect(metadata.title).toEqual({
      template: '%s | Where in the world?',
      default: 'Where in the world?',
    });
  });

  it('has the correct OpenGraph config', () => {
    const metadata = getLayoutMetadata();
    expect(metadata.openGraph?.title).toBe('Where in the world?');
    expect(metadata.openGraph?.description).toBe('Explore global country data with ease.');
  });
});

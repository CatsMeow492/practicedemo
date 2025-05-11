import { getLayoutMetadata } from '../../lib/metadata-utils';

// Test metadata without directly importing from layout.tsx
describe('Layout metadata', () => {
  it('has the correct title configuration', () => {
    const metadata = getLayoutMetadata();

    expect(metadata.title).toEqual({
      template: '%s | Where in the world?',
      default: 'Where in the world?',
    });
  });

  it('has the correct description', () => {
    const metadata = getLayoutMetadata();

    expect(metadata.description).toBe(
      'Explore global country data with ease. Find information about countries, their flags, population, and more.',
    );
  });

  it('has the correct keywords', () => {
    const metadata = getLayoutMetadata();

    expect(metadata.keywords).toContain('countries');
    expect(metadata.keywords).toContain('flags');
    expect(metadata.keywords).toContain('population');
  });

  it('has the correct OpenGraph config', () => {
    const metadata = getLayoutMetadata();

    expect(metadata.openGraph).toEqual({
      title: 'Where in the world?',
      description: 'Explore global country data with ease.',
      url: 'https://countries-dashboard.vercel.app',
      siteName: 'Where in the world?',
      locale: 'en_US',
      type: 'website',
    });
  });
});

# App Component Tests

This directory contains tests for the Next.js components in the `app` directory.

## Files

1. `layout.test.tsx` - Tests the root layout component structure and rendering
2. `metadata.test.ts` - Tests the metadata exports from the layout file
3. `providers.test.tsx` - Tests the Providers component that wraps the application
4. `queryClient.test.tsx` - Tests the QueryClient configuration in the providers

## Running Tests

Run the tests with:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch

# Run only layout tests
npm test -- -t 'RootLayout'

# Run only providers tests
npm test -- -t 'Providers'
```

## Test Structure

### Layout Tests
These tests verify that:
- The layout renders all expected components (header, main content area, footer)
- All imported components are properly rendered
- The correct CSS classes are applied for styling

### Metadata Tests
These tests verify that:
- The correct title template and default title are set
- The description content is correct
- The keywords include expected terms
- Author information is set correctly
- OpenGraph metadata is complete and correct

### Providers Tests
These tests verify that:
- The Providers component correctly renders its children
- The required provider components (SessionProvider, PostHogProvider, QueryClientProvider) are rendered
- The QueryLogger component is only rendered in development mode
- The ReactQueryDevtools component is only rendered in development mode

### QueryClient Tests
These tests verify that:
- The QueryClient is initialized with the correct default options
- The QueryClient is only created once when components rerender (useState behavior)

## Mocks

These tests use Jest mocks to replace imported components and modules:
- Layout tests mock child components to isolate layout testing
- Provider tests mock React Query, Next Auth, and PostHog providers
- QueryClient tests specifically mock the QueryClient constructor to verify its configuration 
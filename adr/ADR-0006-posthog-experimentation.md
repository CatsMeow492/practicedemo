# ADR-0006: PostHog A/B Experimentation Setup for Enhanced Flag Animation

Date: 2025-05-10

## Status

Proposed

## Context

We need to implement an A/B test to evaluate the impact and user reception of an "enhanced flag animation" feature. This involves:
1.  Assigning users to a "test" or "control" variant for the `enhanced-flag-animation` experiment.
2.  Displaying the assigned variant in the application header for visibility during development and testing.
3.  Applying a CSS-based waving animation to flag images for users in the "test" variant. This animation should appear on both the main country grid and individual country detail pages.
4.  Displaying additional information fetched from Wikipedia on the country detail page, specifically for users in the "test" variant.

PostHog is chosen as the A/B testing and feature flag management tool due to its robust features and existing integration points (as per `posthog-integration` rule).

## Decision

1.  **PostHog Client-Side Integration**:
    *   A client component (`src/components/PostHogExperimentDisplay.tsx`) will be used to fetch the feature flag (`enhanced-flag-animation`) from PostHog when the application loads.
    *   This component will also display the current user's variant in the application header (`app/layout.tsx`).
    *   If the user is assigned the "test" variant, this component will add a specific CSS class (`enhanced-flag-animation-test`) to the `<body>` element. This class will be used to conditionally apply styles.

2.  **CSS Animation for "Test" Variant**:
    *   CSS keyframes and styles for a "waving flag" animation will be added to `app/globals.css`.
    *   These styles will be scoped to apply only when the `enhanced-flag-animation-test` class is present on the `<body>`.
    *   The `CountryCard.tsx` component (`src/components/CountryCard.tsx`) and the flag display on the country detail page (`app/country/[code]/page.tsx`) will be updated with the necessary HTML structure (a wrapper `div` and an overlay `div`) to support the animation. The classes for these elements will be `.waving-flag-container` and `.waving-flag-overlay`.

3.  **Conditional Wikipedia Information Display**:
    *   A new client component (`src/components/WikipediaInfo.tsx`) will be created.
    *   This component will accept a `countryName` prop.
    *   It will check for the presence of the `enhanced-flag-animation-test` class on the `document.body`.
    *   If the class is present (i.e., user is in the "test" variant), it will fetch a summary for the given country from the Wikipedia API.
    *   The fetched summary will be displayed on the country detail page (`app/country/[code]/page.tsx`). The summary will be truncated to 400 characters with an ellipsis if longer.

4.  **PostHog SDK Setup Note**:
    *   Ideally, PostHog client-side SDK requests should be routed through a reverse proxy for enhanced privacy, ad-blocker resilience, and to keep API keys out of the client-side bundle if not using an environment variable specifically for client-side PostHog.
    *   Implementing a reverse proxy (e.g., using Next.js API routes or a dedicated edge function) would require coordination with backend engineers and/or further infrastructure setup. This is noted as a desirable improvement but is out of scope for the initial implementation of this experiment.

## Consequences

*   The application will now have a mechanism for running client-side A/B tests managed by PostHog.
*   The "enhanced flag animation" feature will provide a visually distinct experience for users in the "test" group.
*   The country detail page will be augmented with Wikipedia data for the "test" group, potentially increasing engagement or information value.
*   The CSS animation is complex and may have performance implications, especially on lower-powered devices. This should be monitored.
*   Direct client-side calls to PostHog (without a reverse proxy) might be blocked by some ad-blockers or privacy tools, potentially skewing experiment results.

## Follow-ups

1.  Monitor the performance impact of the CSS flag animation.
2.  Evaluate user feedback and engagement metrics for the "test" variant.
3.  Investigate and plan the implementation of a reverse proxy for PostHog API calls in coordination with backend/infrastructure resources.
4.  Ensure the PostHog API key is correctly configured using environment variables as per the `posthog-integration` rule (`NEXT_PUBLIC_POSTHOG_KEY`). 
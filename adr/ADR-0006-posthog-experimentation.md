# ADR-0006: PostHog A/B Experimentation Setup for Enhanced Features

Date: 2025-05-10

## Status

Proposed

## Context

We need to implement an A/B test to evaluate the impact and user reception of several enhanced features. This involves:

1.  Assigning users to a "test" or "control" variant for an experiment named `enhanced-features` (internally, the flag might be `enhanced-flag-animation` or similar, but the scope has expanded).
2.  Displaying the assigned variant in the application header.
3.  For users in the "test" variant:
    a. Applying a CSS-based waving animation to flag images on the main country grid and individual country detail pages.
    b. Displaying additional country information fetched from Wikipedia on the country detail page.
    c. Providing an AI-powered Q&A section on the country detail page, allowing users to ask questions about the country and receive answers generated via the OpenAI API.

PostHog is chosen for A/B testing. The OpenAI API will be used for the Q&A feature.

## Decision

1.  **PostHog Client-Side Integration (`src/components/PostHogExperimentDisplay.tsx`)**:

    - Fetches the feature flag (e.g., `enhanced-flag-animation`).
    - Displays the user's variant in `app/layout.tsx`.
    - Adds a CSS class (`enhanced-flag-animation-test`) to `<body>` for "test" variant users to enable conditional styling/features.

2.  **CSS Waving Flag Animation ("Test" Variant)**:

    - Styles and keyframes in `app/globals.css` scoped by `body.enhanced-flag-animation-test`.
    - HTML structure updates in `src/components/CountryCard.tsx` and `app/country/[code]/page.tsx` (using `.waving-flag-container`, `.waving-flag-overlay`).

3.  **Conditional Wikipedia Information Display ("Test" Variant)**:

    - Client component `src/components/WikipediaInfo.tsx` fetches and displays a Wikipedia summary on `app/country/[code]/page.tsx` if `enhanced-flag-animation-test` class is present.
    - Summary truncated to 400 characters with ellipsis.

4.  **AI-Powered Country Q&A ("Test" Variant)**:

    - A Next.js API route (`app/api/ask-country-ai/route.ts`) securely handles requests to the OpenAI API using an `OPEN_AI_API_KEY` from environment variables.
    - A new client component (`src/components/CountryQA.tsx`) is added to `app/country/[code]/page.tsx`.
    - This component renders only for the "test" variant (checking the body class).
    - It provides an input for user questions, displays recommended questions, and calls the `/api/ask-country-ai` route to fetch and display answers.

5.  **PostHog SDK Setup Note**:

    - Ideally, PostHog client-side SDK requests should be routed through a reverse proxy for enhanced privacy and ad-blocker resilience.
    - This is a desirable improvement but out of scope for this initial experiment phase.

6.  **OpenAI API Key Management**:
    - The `OPEN_AI_API_KEY` must be securely stored in environment variables (e.g., `.env.local`) and accessed only server-side via the API route.

## Consequences

- Establishes a robust A/B testing framework for multi-feature experiments.
- "Test" variant offers a significantly enriched user experience with animations, Wikipedia data, and AI Q&A.
- Increased reliance on external APIs (Wikipedia, OpenAI) and associated costs/rate limits for the "test" variant.
- CSS animation and multiple client-side components might impact performance; monitoring is crucial.
- Direct client-side PostHog calls (no reverse proxy) might be blocked by some tools.
- The API route for OpenAI introduces a new server-side dependency and potential point of failure if the OpenAI API is unavailable.

## Follow-ups

1.  Monitor performance (CSS animation, API latencies) and cost implications (OpenAI API usage).
2.  Evaluate user feedback and engagement for all new features in the "test" variant.
3.  Prioritize implementation of a reverse proxy for PostHog.
4.  Ensure all API keys (`POSTHOG_KEY`, `OPEN_AI_API_KEY`) are correctly configured and secured.
5.  Consider adding more robust error handling and loading states for the AI Q&A feature.
6.  Confirm `openai` package is added to `package.json` and installed.

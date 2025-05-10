# Countries Dashboard

A full-stack demo project showcasing a polished developer experience while delivering a responsive Countries information explorer. Built with **Next.js 13 App Router**, **TypeScript**, **Tailwind CSS**, and **React Query**.

---

## ✨ Feature Highlights

• Server-side rendered list of all countries powered by the public [REST Countries v3](https://restcountries.com/) API.
• Search & region filtering with instant feedback (React Query caching).
• Accessible dark/light theme toggle using Tailwind semantic tokens.
• Detail page with bordering-country shortcuts and SEO-ready metadata.
• Unit tests (Jest + Testing-Library) and E2E coverage (Playwright).
• Authentication with NextAuth.js (GitHub and demo credentials).
• Optimized image loading with Next.js Image and custom API route.
• Docker containerization for local development and production.

> Refer to [`20step.md`](20step.md) for the complete project roadmap.

---

## 🛠 Development

```bash
# Install deps (Node 18 LTS)
npm ci

# Run the dev server
npm run dev

# Lint & type-check
npm run lint  # ESLint
npm run type-check  # tsc --noEmit

# Unit tests
npm test

# E2E tests
npm run test:e2e
```

### Using Docker

```bash
# Development mode
docker-compose up app

# Production mode
docker-compose up app-prod
```

### Storybook

```bash
npm run storybook
```

---

## 🚀 Deployment

The project is configured for zero-config deployment on **Vercel** out-of-the-box. Push to `main` and a preview link will be generated automatically.

### CI/CD Setup

The project includes a GitHub Actions workflow that:

1. Runs linting and type checking
2. Executes unit tests and E2E tests
3. Deploys preview environments for PRs
4. Deploys to production when merged to main

To set up the Vercel deployment in GitHub Actions:

1. Generate a Vercel token at https://vercel.com/account/tokens
2. Get your Vercel Organization ID and Project ID from the project settings page
3. Add the following secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel Organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel Project ID

---

## 📚 Tech Stack & Decisions

See [adr/ADR-0001.md](adr/ADR-0001.md) for the architectural decision record detailing why each technology was chosen.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Countries Dashboard                     │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                  Next.js App Router                      │
├─────────────────┬─────────────────────┬─────────────────┤
│   Server        │     Client          │     API         │
│   Components    │     Components      │     Routes      │
└────────┬────────┴──────────┬──────────┴────────┬────────┘
         │                   │                   │
┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
│   React Query   │ │    UI           │ │    NextAuth     │
│   Data Hooks    │ │    Components   │ │    Auth         │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────┬───────┴───────────┬───────┘
                     │                   │
           ┌─────────▼─────────┐ ┌───────▼─────────┐
           │  REST Countries   │ │  GitHub OAuth   │
           │  API              │ │  Provider       │
           └───────────────────┘ └─────────────────┘
```

## ✅ Roadmap Progress

| Step | Description                  | Status                              |
| ---- | ---------------------------- | ----------------------------------- |
| 1    | Bootstrap repo & CI          | ✅ Done                             |
| 2    | Living README                | ✅ Done                             |
| 3    | Architecture Decision Record | ✅ Done (ADR-0001)                  |
| 4    | Prettier + Husky hooks       | ✅ Done                             |
| 5    | Storybook setup              | ✅ Done                             |
| 6    | Theme token file             | ✅ Tailwind config added            |
| 7    | Basic routes & layout        | ✅ Root layout scaffolded           |
| 8    | REST Countries API wrapper   | ✅ Done with Axios + Zod            |
| 9    | React Query hooks            | ✅ Done (useCountries, useCountry)  |
| 10   | Hook unit tests              | ✅ Done (Jest + RTL)                |
| 11   | CountryCard component        | ✅ Done with Storybook stories      |
| 12   | Countries grid page          | ✅ Done with search and filtering   |
| 13   | Playwright integration tests | ✅ Done                             |
| 14   | Country detail template      | ✅ Done with border countries       |
| 15   | Accessibility & SEO          | ✅ Done with AccessibleImage        |
| 16   | Auth stub (NextAuth)         | ✅ Done with GitHub provider        |
| 17   | Lighthouse & performance     | ✅ Done with server components      |
| 18   | Containerization             | ✅ Done with multi-stage Dockerfile |
| 19   | Deployment config            | ✅ Done with Vercel config          |
| 20   | Final docs & release         | ✅ Done                             |

## 🔮 Future Work

Here are some potential improvements for future iterations:

1. **Pagination**: Implement pagination for large result sets when filtering countries.
2. **State Management**: Consider using Redux or Zustand for more complex state requirements.
3. **Internationalization**: Add i18n support with next-intl or react-i18next.
4. **Advanced Search**: Implement more advanced search features like filtering by population range.
5. **Offline Support**: Add service worker for offline capabilities.
6. **Analytics**: Integrate with a privacy-focused analytics solution.
7. **CI/CD Pipeline**: Enhance the GitHub Actions workflow with automated deployments.
8. **Persistent User Preferences**: Store theme and filter preferences in localStorage.
9. **Application Monitoring**: Enhanced with New Relic for application performance monitoring.

## 📊 Monitoring with New Relic

The application is integrated with New Relic for comprehensive monitoring of both server and client-side performance:

### Setup Requirements

To enable New Relic monitoring, you need to set the following environment variables:

```bash
# New Relic Server Monitoring
NEW_RELIC_LICENSE_KEY=your_new_relic_license_key_here
NEW_RELIC_APP_NAME=countries-dashboard
NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true

# New Relic Browser Monitoring
NEXT_PUBLIC_NEW_RELIC_BROWSER_LICENSE_KEY=your_browser_license_key_here
NEXT_PUBLIC_NEW_RELIC_APPLICATION_ID=your_application_id_here
```

### Starting with New Relic

The application includes custom scripts for running with New Relic monitoring:

```bash
# Development with New Relic
npm run dev:newrelic

# Production with New Relic
npm run start:newrelic
```

### Features

- Server-side transaction monitoring
- Client-side performance tracking
- Custom transaction naming for Next.js routes
- Distributed tracing across the full stack
- Error tracking and reporting

## 📝 License

MIT

<!-- Forcing a fresh deployment -->

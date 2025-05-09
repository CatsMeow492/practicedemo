# Countries Dashboard

A full-stack demo project showcasing a polished developer experience while delivering a responsive Countries information explorer. Built with **Next.js 13 App Router**, **TypeScript**, **Tailwind CSS**, and **React Query**.

---

## ✨ Feature Highlights

• Server-side rendered list of all countries powered by the public [REST Countries v3](https://restcountries.com/) API.
• Search & region filtering with instant feedback (React Query caching).
• Accessible dark/light theme toggle using Tailwind semantic tokens.
• Detail page with bordering-country shortcuts and SEO-ready `<Head>` meta tags.
• Unit tests (Jest + Testing-Library) and E2E coverage (Playwright).

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
```

### Storybook (soon)
```bash
npm run storybook
```

---

## 🚀 Deployment
The project is configured for zero-config deployment on **Vercel** out-of-the-box. Push to `main` and a preview link will be generated automatically.

---

## 📚 Tech Stack & Decisions

See [adr/ADR-0001.md](adr/ADR-0001.md) for the architectural decision record detailing why each technology was chosen.

## ✅ Roadmap Progress

| Step | Description | Status |
|------|-------------|--------|
| 1 | Bootstrap repo & CI | ✅ Done |
| 2 | Living README | ✅ Done |
| 3 | Architecture Decision Record | ✅ Done (ADR-0001) |
| 4 | Prettier + Husky hooks | ✅ Done |
| 5 | Storybook setup | ✅ Done |
| 6 | Theme token file | ✅ Tailwind config added |
| 7 | Basic routes & layout | ✅ Root layout scaffolded |
| 8 | REST Countries API wrapper | ✅ Done with Axios + Zod |
| 9 | React Query hooks | ✅ Done (useCountries, useCountry) |
| 10 | Hook unit tests | ✅ Done (Jest + RTL) |
| 11 | CountryCard component | ✅ Done with Storybook stories |
| 12 | Countries grid page | ✅ Done with search and filtering |
| 13 | Playwright integration tests | 🔄 In-progress |
| 14 | Country detail template | ✅ Done with border countries |

*(See [20step.md](20step.md) for full list)*

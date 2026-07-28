# Kurata

Kurata is a responsive property-land marketplace prototype for Indonesia. It helps users browse land listings, view property details, understand Kurata services, apply as a broker, and submit initial consultation requests.

## Features

- Land search with URL-based filters, sorting, pagination, and empty states
- Static property-detail pages with galleries, facts, contact prompt, and related listings
- Layanan Kurata page with service catalog, consultation form, and clear professional-scope guidance
- Broker Partner information and registration form
- Masuk and Daftar pages with accessible form validation and password visibility controls
- Responsive navigation, shared design system, metadata, and Kurata logo favicon

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage and land-search entry point |
| `/cari-tanah` | Search and filter land listings |
| `/cari-tanah/[id]` | Property detail page |
| `/layanan` | Kurata service information and consultation form |
| `/untuk-broker` | Broker Partner program and registration form |
| `/masuk` | Sign-in form |
| `/daftar` | Account registration form |

## Tech stack

- Next.js 16 with App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Lucide icons

## Run locally

Prerequisites: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

```bash
npm run dev       # Start the local development server
npm run lint      # Run ESLint
npm run build     # Create the production build
npx tsc --noEmit  # Type-check without emitting files
```

## Project structure

```text
src/
├── app/             # Routes, layouts, metadata, and Server Actions
├── application/     # Use cases, DTOs, mappers, and configuration
├── domain/          # Entities, value objects, and repository contracts
├── infrastructure/  # Mock data, repository implementations, DI container
└── presentation/    # UI components grouped by feature
```

## Development notes

This prototype deliberately uses mock repositories and in-memory submission flows for property inquiries, broker registration, and authentication forms. They validate input but do not persist data, create accounts, or establish user sessions.

Before production use, connect the forms to durable storage and a real authentication provider, implement authorization, and replace mock property data with a verified content source.

## Deploy a demo to Vercel

1. Push the repository to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Keep the detected Next.js settings and click **Deploy**.

The default Vercel build command is `npm run build`; no additional environment variables are currently required.

> Vercel's Hobby plan is intended for personal, non-commercial projects. Choose a production-appropriate plan and hosting setup before launching Kurata commercially.

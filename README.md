# Kurata

Kurata is a production-ready property-land marketplace for Indonesia. It helps users browse land listings, view property details, understand Kurata services, apply as a broker, create accounts, and submit consultation, investment, and support requests.

## Features

- Land search with URL-based filters, sorting, pagination, and empty states
- Property-detail pages with galleries, facts, contact prompt, related listings, and per-user favorites
- Layanan Kurata page with a database-driven service catalog and consultation form
- Broker Partner information and registration form (persisted)
- Potensi Lahan investment guidance with database-driven analysis content
- Blog with article discovery, category filters, and search
- Help Center with FAQ search and support requests (persisted)
- Real account registration and session-based login with Argon2id password hashing
- Role-protected admin console, user dashboard, and broker workspace backed by PostgreSQL

## Tech stack

- Next.js 16 with App Router, React 19, TypeScript
- PostgreSQL via Drizzle ORM (3 schemas: `auth`, `core`, `content`)
- Tailwind CSS 4, Lucide icons
- Session-based auth with Argon2id password hashing (SHA-256 token hashing)
- Vitest for unit tests

## Project structure

```text
src/
├── app/             # Routes, layouts, metadata, and Server Actions
├── application/     # Use cases, DTOs, mappers, and configuration
├── domain/          # Entities, value objects, and repository contracts
├── infrastructure/  # Database client, schema, repositories, auth, DI container
├── lib/             # Shared utilities
└── presentation/    # UI components grouped by feature
```

All data is served from PostgreSQL through repository implementations wired in `src/infrastructure/di/container.ts`. There are no mock repositories or in-memory stores in the runtime application; seed scripts populate initial content.

## Run locally

Prerequisites: Node.js 20 or newer, npm, and a local PostgreSQL instance.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env.local
   # Set DATABASE_URL, DATABASE_MIGRATION_URL, and DATABASE_TEST_URL
   ```

3. Create the database roles and schemas (see `scripts/database/grant-runtime-access.sql`), then apply migrations:

   ```bash
   npm run db:migrate
   ```

4. Seed content and demo accounts:

   ```bash
   npm run db:seed:content   # statistics, blog, properties, service catalog, FAQs, investasi content
   npm run db:seed:auth      # demo user, broker, admin, and super_admin accounts
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

```bash
npm run dev            # Start the local development server
npm run lint           # Run ESLint
npm run build          # Create the production build
npm run test           # Run unit tests (Vitest)
npm run test:watch     # Run unit tests in watch mode
npx tsc --noEmit       # Type-check without emitting files
npm run db:generate    # Generate a Drizzle migration from schema changes
npm run db:migrate     # Apply pending migrations
npm run db:seed:auth   # Seed demo accounts (local only by default)
npm run db:seed:content# Seed public content (statistics, blog, properties, sections)
```

## Deploy to production

### 1. Provision PostgreSQL

Create a managed PostgreSQL database (e.g. Supabase, Neon, RDS) and capture the connection string. Create two connection roles:

- `kurata_app` — runtime read/write access (used by `DATABASE_URL`)
- `kurata_owner` — schema and migration access (used by `DATABASE_MIGRATION_URL`)

Apply the privilege grants from `scripts/database/grant-runtime-access.sql` after the schemas exist.

### 2. Configure environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Runtime connection (restricted `kurata_app` role) |
| `DATABASE_MIGRATION_URL` | Migration connection (`kurata_owner` role); never expose to the browser |
| `DATABASE_TEST_URL` | Isolated test database |
| `ALLOW_REMOTE_DEMO_SEED` | Set to `"true"` only to seed a remote demo database |

### 3. Migrate and seed

Run once against the production database:

```bash
npm run db:migrate
npm run db:seed:content
```

For a remote database, seed accounts with:

```bash
ALLOW_REMOTE_DEMO_SEED=true DEMO_USER_PASSWORD=<...> DEMO_ADMIN_PASSWORD=<...> DEMO_MASTER_ADMIN_PASSWORD=<...> npm run db:seed:auth
```

> Demo passwords must be at least 16 characters. Do not ship demo accounts to production; create real admin accounts instead.

### 4. Deploy

```bash
npm run build
npm start
```

For Vercel: import the repository, keep the detected Next.js settings, add the environment variables above, and deploy. Ensure the database is reachable from the hosting region and that migrations have already been applied.

### Production checklist

- [ ] Rotate and secure all database credentials; restrict `auth_private` schema access
- [ ] Remove demo accounts or restrict them to a staging environment
- [ ] Configure backup/point-in-time recovery on the managed database
- [ ] Set up a staging database to validate migrations before production
- [ ] Add rate limiting and abuse protection to public forms and login
- [ ] Serve uploaded documents via private storage with signed, expiring URLs

## Development notes

The application follows a clean-architecture layering:

- `domain/` — entities and repository interfaces (no framework dependencies)
- `application/` — use cases orchestrate repositories and return DTOs
- `infrastructure/` — PostgreSQL repositories, Drizzle schema, auth, and the DI container
- `presentation/` — server components fetch via use cases; client components receive data as props

Public content (service catalog, FAQs, investasi sections, statistics, blog) lives in the `content` schema and is editable without code changes. Form submissions (broker applications, service/investment inquiries, support requests) persist to `content.forms`. Admin review decisions update `content.properties`/`content.forms` review status via Server Actions.

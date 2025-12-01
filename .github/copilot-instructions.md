<!--
Guidance for AI coding assistants working on this repository.
Keep this file concise and actionable: focus on patterns, conventions,
build/run commands, integration points, and concrete examples from the codebase.
-->

# Copilot instructions — PurrTech (LITTERFLOW)

Short, high-value notes to help coding agents be productive immediately.

- Architecture: Next.js (App Router) application with serverless API routes.
  - App entry: `app/` (Next 16 app-router). Pages and layouts are server components by default.
  - API routes: `app/api/*/route.ts` use `NextRequest` / `NextResponse` and run server-side.
  - Frontend helpers: `lib/api-client.ts` centralizes fetch calls and injects `x-user-id` header.
  - DB helpers: `lib/db.ts` exposes Supabase client factories (`createServerSupabaseClient`).

- Key workflows / commands
  - Install: `npm install` (project uses `package.json` scripts). Lockfile `pnpm-lock.yaml` present — either `npm` or `pnpm` may be used in developer environments.
  - Dev: `npm run dev` -> starts Next dev server (http://localhost:3000).
  - Build: `npm run build`; Start: `npm run start`.
  - Lint: `npm run lint` (ESLint).
  - DB init: `scripts/001-init-database.sql` — used with Supabase/Neon per `SETUP.md`.

- Environment variables to watch for
  - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_API_URL` (overrides `/api` base for `lib/api-client.ts`)
  - `.env.local` is used in local setup (see `SETUP.md`).

- API conventions & examples
  - All protected endpoints expect an `x-user-id` header (see `docs/API.md`).
  - Error responses follow: `{ success: false, error: "message" }`.
  - Success responses include `success: true` plus domain data (examples in `app/api/*.ts`).
  - Device integration: IoT devices POST to `POST /api/litter-visits` with JSON:
    ```json
    { "catId": "...", "duration": 240, "weight": 4.2, "deviceToken": "..." }
    ```
    See `app/api/litter-visits/route.ts` and `SETUP.md` for expected payload and simple anomaly logic.

- Implementation patterns to follow
  - API route skeletons often use console logs and `TODO` comments where DB integrations are missing — maintain the existing response shapes when modifying.
  - Use `lib/api-client.ts` when adding or changing frontend API calls (it injects `x-user-id` from localStorage).
  - Prefer server-side Supabase helpers in `lib/db.ts` for server routes.
  - Mock data is frequently used in API routes for local dev; preserve the mock shapes if replacing with DB queries.

- Files/paths to reference when implementing features
  - `app/api/*/route.ts` — place to add or change server endpoints.
  - `lib/api-client.ts` — frontend API helper and canonical response shape.
  - `lib/db.ts` — DB client and domain types (User, Cat, LitterVisit, HealthAlert).
  - `components/` and `components/ui/` — UI primitives, follow existing patterns for props and styling.
  - `scripts/001-init-database.sql` — canonical DB schema used during setup.
  - `SETUP.md` and `docs/API.md` — authoritative developer and API notes.

- Testing & debugging notes
  - There are no automated tests in the repo; changes should be validated by running `npm run dev` and exercising endpoints.
  - Use `curl` or Postman to test API routes (remember to add `x-user-id` for protected endpoints).
  - API routes return simple JSON shapes — validate `success` and the payload keys.

- Common pitfalls to avoid
  - Don’t assume DB integration exists: many `app/api/*/route.ts` files have `TODO` sections and currently return mock data.
  - Preserve public API shapes and header requirements when changing server routes.
  - When adding server code, ensure environment variables used by `lib/db.ts` are present in the dev environment.

If anything above is unclear or you want me to expand examples for a particular area (e.g., migrating a mock route to Supabase), tell me which route or feature to focus on and I will update this file accordingly.

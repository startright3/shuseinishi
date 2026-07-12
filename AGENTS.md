# Codex development instructions

## Product

Build **START RIGHT Event Cloud**, a Japanese multi-tenant SaaS for membership organizations and recurring events.

Core domains:
- organizations and venues
- members and membership status history
- events and attendance responses
- QR check-in and guests
- staff roles and invitations
- plans and subscriptions
- audit logs

## Technology

- Next.js App Router
- TypeScript with `strict: true`
- Tailwind CSS
- Supabase Auth, PostgreSQL, RLS and Edge Functions
- pnpm
- Vitest and Playwright
- Vercel

## Existing Supabase project

Project ref: `fmihnxwsajszldzizzcn`

Existing Edge Functions:
- `reception-api`
- `admin-api`
- `admin-app`

Do not guess the production schema. Inspect generated database types, existing migrations and existing APIs before implementing data access.

## Security requirements

- Never commit secrets.
- Never expose a service-role key to client code.
- Only `NEXT_PUBLIC_SUPABASE_URL` and a publishable/anon key may be used in browser code.
- Preserve tenant isolation and RLS.
- Do not make destructive production database changes.
- Record every schema change in `supabase/migrations`.
- Prefer the authenticated `admin-api` for privileged operations.
- Validate all form and API input.
- Confirm destructive actions in the UI.

## UI requirements

- Japanese interface.
- Mobile Safari and iPad first.
- Minimum comfortable touch targets.
- Accessible labels, focus states and error messages.
- Avoid `any`; explain any unavoidable exception.

## Work process

1. Read `docs/IMPLEMENTATION_PLAN.md`.
2. Keep changes small and reviewable.
3. Run `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` before requesting review.
4. Update documentation when architecture or environment variables change.
5. Summarize completed work, remaining work and risks in the PR description.

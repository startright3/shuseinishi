# Codex task: Sprint 1 foundation

Work on branch `codex/sprint-1-foundation` and implement GitHub Issue #1.

## Required workflow

1. Inspect the repository and read:
   - `AGENTS.md`
   - `docs/IMPLEMENTATION_PLAN.md`
   - `docs/ARCHITECTURE.md`
2. Create the Next.js application in the repository root.
3. Use pnpm and TypeScript strict mode.
4. Implement only the foundation/auth/protected admin shell scope from Issue #1.
5. Do not modify the production Supabase schema.
6. Do not add a service-role key.
7. Use the existing values documented in `.env.example` without committing a real publishable key.
8. Make small commits with descriptive messages.
9. Run:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm build`
10. Update draft PR #2 with:
   - completed work
   - test results
   - screenshots or route notes
   - remaining risks

## First implementation slice

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- environment validation
- Supabase browser/server clients
- auth middleware
- `/login`
- `/reset-password`
- `/auth/callback`
- protected `/admin`
- responsive Japanese admin shell
- Vitest and Playwright smoke setup

Do not implement members, events, check-ins, staff invitations or Stripe in this slice.

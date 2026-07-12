# Sprint 1 implementation plan

## Objective

Replace the temporary single-file admin UI with a maintainable Next.js application connected to the existing Supabase backend.

## Deliverables

### 1. Application foundation

- Initialize Next.js App Router with TypeScript strict mode.
- Configure pnpm, Tailwind CSS, ESLint and formatting.
- Add environment validation.
- Add typed Supabase browser and server clients.
- Prepare Supabase database type generation.

### 2. Authentication

- Email and password sign-in.
- Sign-up for the designated initial owner flow.
- Password reset request and callback.
- Auth session refresh through middleware.
- Redirect unauthenticated users away from `/admin`.

### 3. Admin shell

- Responsive Japanese navigation.
- Dashboard route.
- Members route.
- Events route.
- Check-ins route.
- Staff route.
- Account/logout controls.
- Mobile Safari and iPad layout verification.

### 4. Data-access layer

- Typed wrapper around the authenticated `admin-api` Edge Function.
- Standard error model.
- Request cancellation and loading states.
- No service-role key in the application.
- No direct privileged mutation from the browser.

### 5. Member management

- List and search.
- Status filter.
- Create and edit.
- Pause, restore and resign.
- Rotate QR token with confirmation.
- CSV import preview and validation.
- CSV export.

### 6. Event and reception management

- List, create and edit events.
- Event status changes.
- Check-in list.
- Check-in cancellation with reason.
- CSV export.

### 7. Staff invitation

- List active invitations.
- Create an invitation with role and venue.
- Display copyable invitation URL.
- Explain expiry and permission level.

### 8. Quality gates

- Unit tests for validation and API client behavior.
- Playwright smoke tests for login and protected routing.
- `pnpm lint` passes.
- `pnpm typecheck` passes.
- `pnpm test` passes.
- `pnpm build` passes.

## Implementation order

1. Foundation and environment validation.
2. Supabase clients and auth middleware.
3. Login/reset screens and protected admin shell.
4. Typed `admin-api` client.
5. Dashboard and members.
6. Events and check-ins.
7. Staff invitations.
8. Tests, documentation and Vercel deployment configuration.

## Constraints

- Existing production tables and Edge Functions must remain operational.
- Do not run destructive migrations.
- Do not commit real credentials.
- Do not introduce Stripe in Sprint 1.
- Do not implement speculative columns or RPCs.

## Definition of done

The Sprint is complete when an authenticated organization owner can sign in on iPhone/iPad Safari and operate members, events, check-ins and staff invitations through the existing authenticated backend, with all quality gates passing.

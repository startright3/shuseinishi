# Architecture

## Overview

The web application is a Next.js frontend deployed to Vercel. Authentication and tenant-aware data access use the existing Supabase project.

```text
Browser / Next.js
  ├─ Supabase Auth
  ├─ Server Components and Route Handlers
  └─ authenticated calls to admin-api
          └─ PostgreSQL with RLS
```

## Supabase

Project ref: `fmihnxwsajszldzizzcn`

### Existing tables

- `organizations`
- `organization_members`
- `venues`
- `members`
- `member_status_history`
- `events`
- `attendance_responses`
- `checkins`
- `guests`
- `staff_profiles`
- `organization_invites`
- `plans`
- `subscriptions`
- `audit_logs`

### Existing Edge Functions

- `reception-api`: reception/PIN based workflow
- `admin-api`: authenticated management API
- `admin-app`: temporary standalone management UI

The Next.js application should replace `admin-app` over time, while keeping the reception workflow operational.

## Authentication and authorization

- Supabase Auth provides email/password sessions.
- `/admin` is protected by middleware and server-side session validation.
- Organization membership determines tenant scope.
- `owner` and `admin` may perform privileged management operations.
- `staff` and `reception` have reduced access.
- RLS remains the final data isolation boundary.

## Data mutation rule

Privileged mutations should call the authenticated `admin-api` with the current Supabase access token. Do not place a service-role key in Next.js browser code.

## Frontend route proposal

```text
/login
/reset-password
/auth/callback
/admin
/admin/members
/admin/events
/admin/events/[eventId]/checkins
/admin/staff
/admin/settings
```

## Environment variables

Browser-safe:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_ADMIN_API_URL`

Build/development tooling:

- `SUPABASE_PROJECT_REF`

No service-role key is required for the browser application.

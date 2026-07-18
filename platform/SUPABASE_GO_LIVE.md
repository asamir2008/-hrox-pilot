# HROX Supabase Go-Live

## 1. Generate the bootstrap SQL

From the `platform` directory:

```bash
npm install
npm run supabase:bootstrap
```

This creates:

```text
supabase/bootstrap.sql
```

The generated file combines every migration in filename order, followed by `supabase/seed.sql`.

## 2. Create the Supabase project

Create a new Supabase project and keep the project URL, anon key and service-role key private.

Open the Supabase SQL Editor and run the generated `supabase/bootstrap.sql` once on the fresh project.

## 3. Create Auth users

Create the production users in Supabase Authentication using their real email addresses. Required role groups:

- Senior HR Director
- HR Operations Coordinator
- Assigned HR Directors / Managers
- System Administrator

Confirm each Auth user has a matching `profiles` record with the correct role, title and active status.

## 4. Validate database objects

Confirm the following are present:

- profiles
- projects
- rotation_requests
- rotation_plans
- rotation_assignments
- daily_notes
- visit_reports
- assignment_attachments
- consolidated_reports
- consolidated_report_items
- notifications
- visit-evidence storage bucket

Confirm Row Level Security is enabled on every user-facing table.

## 5. Configure Vercel

Import the GitHub repository into Vercel and set:

```text
Root Directory: platform
Framework Preset: Next.js
```

Add these environment variables for Production, Preview and Development:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.

## 6. First production checks

Open `/api/health` and confirm the mode is `supabase`.

Test the complete workflow in this order:

1. Director signs in and creates a request.
2. Coordinator receives the request and prepares the plan.
3. Director edits and approves the plan.
4. Assigned managers receive their tasks.
5. Manager performs GPS check-in, adds notes and uploads evidence.
6. Manager submits the report.
7. Coordinator returns or accepts the report.
8. Coordinator consolidates selected reports.
9. Director reviews the executive dashboard and printable report.
10. Verify notifications, audit entries and role isolation.

## 7. Security checks

- A manager must not see another manager's assignments.
- A manager must not read another manager's evidence.
- A coordinator must not change administrator-only profile settings.
- An inactive profile must not access protected workspaces.
- Storage objects must require authenticated access.
- Service-role credentials must exist only in server-side environment variables.

## 8. GitHub Actions

The workflow can now be started manually from GitHub Actions using **Run workflow**. It performs:

1. Dependency installation
2. Preflight checks
3. Supabase bootstrap generation
4. TypeScript validation
5. Next.js production build

Do not mark production ready until this workflow is green and the Vercel deployment passes the smoke test.

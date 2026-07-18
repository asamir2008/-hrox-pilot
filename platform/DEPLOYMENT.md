# HROX Production Deployment Runbook

## 1. Create Supabase project

1. Create a new Supabase project.
2. Open SQL Editor.
3. Run the files in `supabase/migrations` in filename order.
4. Run `supabase/seed.sql` after all migrations complete.
5. Confirm the following tables exist: `profiles`, `projects`, `rotation_requests`, `rotation_plans`, `rotation_assignments`, `daily_notes`, `visit_reports`, `notifications`, `assignment_attachments`, `consolidated_reports`, and `consolidated_report_items`.
6. Confirm the private Storage bucket `visit-evidence` exists.

## 2. Create production users

Create users in Supabase Authentication for these roles:

- Senior HR Director
- HR Operations Coordinator
- Assigned HR Director
- System Administrator

After each Auth user is created, add or update the matching row in `profiles` using the Auth user ID. Set `active = true` and assign one of: `director`, `coordinator`, `manager`, or `admin`.

## 3. Configure Vercel

1. Import repository `asamir2008/-hrox-pilot` into Vercel.
2. Set Root Directory to `platform`.
3. Keep Framework Preset as Next.js.
4. Add the following environment variables for Production, Preview, and Development:

```env
NEXT_PUBLIC_SUPABASE_URL=<project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.

## 4. Deploy and validate

After deployment:

1. Open `/api/health` and confirm `mode` is `supabase`.
2. Sign in as each role.
3. Director creates a rotation request.
4. Coordinator builds and submits the plan.
5. Director edits and approves the plan.
6. Verify assignments appear only for their assigned managers.
7. Test GPS check-in, daily notes, evidence upload, report submission, return, acceptance, consolidation, and executive report printing.
8. Verify notifications are visible to the intended recipients.
9. Verify a manager cannot read another manager's assignments, reports, or attachments.

## 5. Go-live checklist

- [ ] GitHub Actions build is green
- [ ] Supabase migrations completed
- [ ] RLS policies enabled
- [ ] Storage policies enabled
- [ ] Production users created
- [ ] Vercel environment variables configured
- [ ] `/api/health` reports Supabase mode
- [ ] Role-permission smoke test passed
- [ ] Executive PDF tested
- [ ] Backup and recovery owner assigned

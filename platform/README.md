# HROX Platform

Production rebuild using Next.js, TypeScript and Supabase.

## Sprint checklist

### Sprint 1 — Authentication and User Foundation
- [x] Next.js project scaffold
- [x] Enterprise login UI
- [x] Demo accounts for Director, Coordinator, Manager and Admin
- [x] Role-based dashboard routing
- [x] Initial Supabase schema
- [x] Browser Supabase client and environment template
- [x] RLS policies for users, projects, requests, plans, assignments, notes and reports
- [x] User directory component with activation status
- [x] Project registry component
- [x] Dual data provider: automatic Demo/Supabase mode
- [x] Database seed script for projects and initial plan
- [ ] Connect real Supabase project
- [ ] Create real users in Supabase Auth

### Sprint 2 — Rotation Request and Planning
- [x] Director creates rotation request in demo workflow
- [x] Coordinator builds shared plan
- [x] Registered demo managers/projects/date selection
- [x] Director edits people, projects and dates directly
- [x] Return, approve and automatic assignment release
- [x] Shared workflow state and activity history
- [x] Transactional Supabase workflow-save RPC
- [x] Supabase workflow load/save adapter
- [x] Dual-mode in-app notification service
- [x] Notification table and RLS policies
- [x] Role-based notification center page
- [x] Workflow notification event mapping for request, review, approval, check-in and reports
- [ ] Invoke notification mapping from every dashboard action
- [ ] Optional email delivery provider

### Sprint 3 — Field Visit Workspace
- [x] Role-filtered manager assignment inbox
- [x] GPS-enabled check-in with location accuracy
- [x] Daily notes
- [x] Private report storage bucket and upload policies
- [x] Evidence upload service with Demo fallback
- [x] Attachments and evidence upload UI
- [x] Final report summary and submission
- [x] Database columns for GPS, report summary and coordinator comments
- [x] Assignment attachment table and RLS
- [ ] Switch dashboard fieldwork actions from local store to Supabase adapter

### Sprint 4 — Coordinator Monitoring
- [x] Status by manager and project
- [x] Report acceptance action
- [x] Select one or multiple completed reports for consolidation
- [x] Return report to manager with comments
- [x] Consolidated submission to Director
- [x] Consolidated report tables and RLS policies
- [ ] Switch coordinator report actions from local store to Supabase adapter

### Sprint 5 — Executive Dashboard
- [x] Completion and overdue KPIs
- [x] Project coverage and pending-review analytics
- [x] Risk alert count
- [x] Decision dashboard handoff state
- [x] CSV export
- [x] Full audit history screen
- [x] Printable executive report page
- [x] Browser Print / Save PDF workflow
- [ ] Add branded cover and signatures to PDF report

### Quality and Deployment
- [x] Vercel build configuration
- [x] `.env.example`
- [x] Health endpoint showing Demo/Supabase mode
- [x] GitHub Actions CI for TypeScript and production build
- [ ] Confirm first CI build is green
- [ ] Import repository into Vercel using `platform` as Root Directory
- [ ] Add Supabase environment variables
- [ ] Run database migrations and `seed.sql`
- [ ] Production smoke test

## Local run

```bash
cd platform
npm install
npm run dev
```

Health check after startup:

```text
http://localhost:3000/api/health
```

## Required environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

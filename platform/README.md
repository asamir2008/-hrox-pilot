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
- [ ] Connect real Supabase project
- [ ] Create real users in Supabase Auth

### Sprint 2 — Rotation Request and Planning
- [x] Director creates rotation request in demo workflow
- [x] Coordinator builds shared plan
- [x] Registered demo managers/projects/date selection
- [x] Director edits people, projects and dates directly
- [x] Return, approve and automatic assignment release
- [x] Shared workflow state and activity history
- [ ] Persist workflow in Supabase
- [ ] Email and in-app assignment notifications

### Sprint 3 — Field Visit Workspace
- [x] Role-filtered manager assignment inbox
- [x] Demo check-in action
- [x] Daily notes
- [x] Private report storage bucket and upload policies
- [ ] GPS-enabled check-in
- [ ] Attachments and evidence upload UI
- [x] Final report submission demo
- [ ] Persist notes and reports in Supabase

### Sprint 4 — Coordinator Monitoring
- [x] Status by manager and project
- [x] Report acceptance action
- [x] Consolidated submission to Director
- [ ] Select one or multiple reports for consolidation
- [ ] Return report to manager with comments

### Sprint 5 — Executive Dashboard
- [x] Initial completion and overdue KPIs
- [x] Decision dashboard handoff state
- [ ] Full risk, delay and coverage analytics
- [ ] Export and audit history

### Deployment
- [x] Vercel build configuration
- [x] `.env.example`
- [ ] Import repository into Vercel
- [ ] Add Supabase environment variables
- [ ] Run database migrations
- [ ] Production smoke test

## Local run

```bash
cd platform
npm install
npm run dev
```

## Required environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

# HROX Platform

Production rebuild using Next.js, TypeScript and Supabase.

## Sprint checklist

### Sprint 1 — Authentication and User Foundation
- [x] Next.js project scaffold
- [x] Enterprise login UI
- [x] Demo accounts for Director, Coordinator, Manager and Admin
- [x] Role-based dashboard routing
- [x] Initial Supabase schema
- [ ] Connect real Supabase project
- [ ] Create real users and RLS policies
- [ ] User directory and account administration

### Sprint 2 — Rotation Request and Planning
- [ ] Director creates rotation request
- [ ] Coordinator builds plan
- [ ] Registered users/projects/date selection
- [ ] Director edits plan directly
- [ ] Return, approve and automatic assignment release

### Sprint 3 — Field Visit Workspace
- [ ] Manager task inbox
- [ ] Check-in
- [ ] Daily notes
- [ ] Attachments
- [ ] Final report submission

### Sprint 4 — Coordinator Monitoring
- [ ] Status by manager and project
- [ ] Individual and consolidated reports
- [ ] Report return/acceptance workflow

### Sprint 5 — Executive Dashboard
- [ ] KPIs, delays, risks and coverage
- [ ] Decision-ready reports
- [ ] Export and audit history

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
```

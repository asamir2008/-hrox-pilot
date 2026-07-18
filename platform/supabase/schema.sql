create type public.user_role as enum ('director','coordinator','manager','admin');
create type public.plan_status as enum ('draft','submitted','returned','approved','active','completed');
create type public.assignment_status as enum ('scheduled','checked_in','in_progress','report_submitted','returned','completed','overdue');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  employee_number text unique,
  job_title text,
  role public.user_role not null default 'manager',
  department text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.rotation_requests (
  id uuid primary key default gen_random_uuid(),
  cycle_name text not null,
  start_date date not null,
  end_date date not null,
  instructions text,
  requested_by uuid not null references public.profiles(id),
  coordinator_id uuid references public.profiles(id),
  status text not null default 'requested',
  created_at timestamptz not null default now()
);

create table public.rotation_plans (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.rotation_requests(id) on delete cascade,
  status public.plan_status not null default 'draft',
  coordinator_notes text,
  director_notes text,
  created_by uuid not null references public.profiles(id),
  approved_by uuid references public.profiles(id),
  submitted_at timestamptz,
  approved_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.rotation_assignments (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.rotation_plans(id) on delete cascade,
  project_id uuid not null references public.projects(id),
  manager_id uuid not null references public.profiles(id),
  visit_start date not null,
  visit_end date not null,
  instructions text,
  status public.assignment_status not null default 'scheduled',
  created_at timestamptz not null default now()
);

create table public.daily_notes (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.rotation_assignments(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  note_date date not null default current_date,
  note_text text not null,
  created_at timestamptz not null default now()
);

create table public.visit_reports (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.rotation_assignments(id) on delete cascade,
  submitted_by uuid not null references public.profiles(id),
  executive_summary text,
  findings text,
  recommendations text,
  submitted_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.rotation_requests enable row level security;
alter table public.rotation_plans enable row level security;
alter table public.rotation_assignments enable row level security;
alter table public.daily_notes enable row level security;
alter table public.visit_reports enable row level security;

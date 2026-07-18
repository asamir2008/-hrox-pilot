alter table public.rotation_assignments
  add column if not exists check_in_latitude double precision,
  add column if not exists check_in_longitude double precision,
  add column if not exists check_in_accuracy double precision,
  add column if not exists checked_in_at timestamptz,
  add column if not exists report_summary text,
  add column if not exists coordinator_comment text,
  add column if not exists selected_for_consolidation boolean not null default false;

create table if not exists public.assignment_attachments (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.rotation_assignments(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.consolidated_reports (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.rotation_plans(id) on delete cascade,
  title text not null,
  status text not null default 'draft',
  submitted_by uuid references public.profiles(id),
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.consolidated_report_items (
  consolidated_report_id uuid not null references public.consolidated_reports(id) on delete cascade,
  assignment_id uuid not null references public.rotation_assignments(id) on delete cascade,
  primary key (consolidated_report_id, assignment_id)
);

alter table public.assignment_attachments enable row level security;
alter table public.consolidated_reports enable row level security;
alter table public.consolidated_report_items enable row level security;

create policy "attachments visible to workflow participants"
on public.assignment_attachments for select to authenticated
using (
  exists (
    select 1 from public.rotation_assignments a
    join public.profiles p on p.id = auth.uid()
    where a.id = assignment_id
      and (p.role in ('director','coordinator','admin') or a.manager_id = auth.uid())
  )
);

create policy "managers upload assignment evidence"
on public.assignment_attachments for insert to authenticated
with check (
  uploaded_by = auth.uid() and exists (
    select 1 from public.rotation_assignments a
    where a.id = assignment_id and a.manager_id = auth.uid()
  )
);

create policy "leadership reads consolidated reports"
on public.consolidated_reports for select to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('director','coordinator','admin')));

create policy "coordinator manages consolidated reports"
on public.consolidated_reports for all to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('coordinator','admin')))
with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('coordinator','admin')));

create policy "leadership reads consolidated report items"
on public.consolidated_report_items for select to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('director','coordinator','admin')));

create policy "coordinator manages consolidated report items"
on public.consolidated_report_items for all to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('coordinator','admin')))
with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('coordinator','admin')));

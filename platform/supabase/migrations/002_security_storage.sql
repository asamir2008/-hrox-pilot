-- HROX row-level security and report storage
alter table profiles enable row level security;
alter table projects enable row level security;
alter table rotation_requests enable row level security;
alter table rotation_plans enable row level security;
alter table assignments enable row level security;
alter table daily_notes enable row level security;
alter table visit_reports enable row level security;

create or replace function public.current_role()
returns text language sql stable security definer set search_path=public as $$
 select role from profiles where id=auth.uid()
$$;

create policy "profiles own or management read" on profiles for select using(id=auth.uid() or current_role() in ('admin','director','coordinator'));
create policy "admin manages profiles" on profiles for all using(current_role()='admin') with check(current_role()='admin');

create policy "authenticated read active projects" on projects for select to authenticated using(active=true or current_role() in ('admin','director','coordinator'));
create policy "admin coordinator manage projects" on projects for all using(current_role() in ('admin','coordinator')) with check(current_role() in ('admin','coordinator'));

create policy "management reads requests" on rotation_requests for select using(current_role() in ('admin','director','coordinator'));
create policy "director creates requests" on rotation_requests for insert with check(current_role()='director' and created_by=auth.uid());
create policy "director coordinator update requests" on rotation_requests for update using(current_role() in ('director','coordinator'));

create policy "management reads plans" on rotation_plans for select using(current_role() in ('admin','director','coordinator'));
create policy "coordinator creates plans" on rotation_plans for insert with check(current_role()='coordinator' and coordinator_id=auth.uid());
create policy "director coordinator edit plans" on rotation_plans for update using(current_role() in ('director','coordinator'));

create policy "assignment visibility" on assignments for select using(current_role() in ('admin','director','coordinator') or manager_id=auth.uid());
create policy "management manages assignments" on assignments for all using(current_role() in ('admin','director','coordinator')) with check(current_role() in ('admin','director','coordinator'));
create policy "manager updates own assignment" on assignments for update using(manager_id=auth.uid()) with check(manager_id=auth.uid());

create policy "notes visibility" on daily_notes for select using(current_role() in ('admin','director','coordinator') or author_id=auth.uid());
create policy "manager creates own notes" on daily_notes for insert with check(author_id=auth.uid() and exists(select 1 from assignments a where a.id=assignment_id and a.manager_id=auth.uid()));
create policy "manager edits own notes" on daily_notes for update using(author_id=auth.uid()) with check(author_id=auth.uid());

create policy "reports visibility" on visit_reports for select using(current_role() in ('admin','director','coordinator') or submitted_by=auth.uid());
create policy "manager submits own reports" on visit_reports for insert with check(submitted_by=auth.uid() and exists(select 1 from assignments a where a.id=assignment_id and a.manager_id=auth.uid()));
create policy "coordinator reviews reports" on visit_reports for update using(current_role() in ('admin','coordinator'));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('visit-reports','visit-reports',false,15728640,array['application/pdf','image/jpeg','image/png','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict(id) do nothing;

create policy "report files visible to workflow users" on storage.objects for select using(bucket_id='visit-reports' and auth.role()='authenticated');
create policy "authenticated upload report files" on storage.objects for insert with check(bucket_id='visit-reports' and auth.role()='authenticated');
create policy "owners and management update report files" on storage.objects for update using(bucket_id='visit-reports' and (owner_id=auth.uid() or current_role() in ('admin','coordinator')));

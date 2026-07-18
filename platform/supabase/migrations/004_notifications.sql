create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_email text not null,
  title text not null,
  message text not null,
  type text not null check (type in ('request','plan','assignment','report','system')),
  entity_id text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "users read own notifications"
on public.notifications for select
to authenticated
using (recipient_email = auth.jwt()->>'email');

create policy "authorized roles create notifications"
on public.notifications for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('director','coordinator','admin')
  )
);

create policy "users update own notification read state"
on public.notifications for update
to authenticated
using (recipient_email = auth.jwt()->>'email')
with check (recipient_email = auth.jwt()->>'email');

create index if not exists notifications_recipient_created_idx
on public.notifications(recipient_email,created_at desc);

create table public.customers (
  id uuid primary key,
  email text not null,
  plan text not null default 'free'
);

create table public.audit_log (
  id uuid primary key,
  event text not null
);

alter table public.audit_log enable row level security;

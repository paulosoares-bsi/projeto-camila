create extension if not exists pgcrypto;

create table if not exists tenants (
  id text primary key,
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null references tenants(id),
  external_contact_id text not null,
  current_state text not null default 'NOVO',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, external_contact_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null references tenants(id),
  lead_id uuid references leads(id),
  direction text not null,
  channel text not null,
  external_message_id text,
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id text primary key,
  tenant_id text not null,
  lead_id text,
  type text not null,
  source text not null,
  occurred_at timestamptz not null,
  payload jsonb not null default '{}',
  status text not null default 'received',
  created_at timestamptz not null default now()
);

create index if not exists events_tenant_occurred_at_idx on events (tenant_id, occurred_at desc);
create index if not exists events_type_idx on events (type);

insert into tenants (id, name, status)
values ('camila-quindere', 'Camila Quindere', 'active')
on conflict (id) do update set name = excluded.name, status = excluded.status;

create table if not exists lead_interests (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  lead_id uuid not null,
  product text not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_lead_interests_lead on lead_interests (tenant_id, lead_id);

create table if not exists lead_escalations (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  lead_id uuid not null,
  reason text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_lead_escalations_lead on lead_escalations (tenant_id, lead_id);
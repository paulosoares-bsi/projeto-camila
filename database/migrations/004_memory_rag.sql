create table if not exists lead_memories (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  lead_id uuid not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_lead_memories_lead on lead_memories (tenant_id, lead_id);
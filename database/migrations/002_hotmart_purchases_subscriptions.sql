create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null references tenants(id),
  transaction_id text not null,
  hotmart_purchase_id text,
  product_id text,
  product_name text,
  buyer_name text,
  buyer_email text,
  buyer_phone text,
  status text,
  payment_type text,
  purchase_date timestamptz,
  approved_date timestamptz,
  refunded_date timestamptz,
  raw_payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, transaction_id)
);

create index if not exists purchases_tenant_purchase_date_idx on purchases (tenant_id, purchase_date desc);
create index if not exists purchases_tenant_status_idx on purchases (tenant_id, status);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null references tenants(id),
  subscription_id text not null,
  status text,
  plan text,
  next_charge_date timestamptz,
  canceled_at timestamptz,
  raw_payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, subscription_id)
);

create index if not exists subscriptions_tenant_status_idx on subscriptions (tenant_id, status);

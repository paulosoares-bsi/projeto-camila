import type pg from "pg";

export interface LeadRecord {
  id: string;
  tenantId: string;
  externalContactId: string;
  currentState: string;
}

export class LeadRepository {
  constructor(private readonly pool: pg.Pool) {}

  async upsertByExternalContact(input: {
    tenantId: string;
    externalContactId: string;
    currentState: string;
  }): Promise<LeadRecord> {
    const result = await this.pool.query<{
      id: string;
      tenant_id: string;
      external_contact_id: string;
      current_state: string;
    }>(
      `insert into leads (tenant_id, external_contact_id, current_state)
       values ($1, $2, $3)
       on conflict (tenant_id, external_contact_id)
       do update set current_state = excluded.current_state, updated_at = now()
       returning id, tenant_id, external_contact_id, current_state`,
      [input.tenantId, input.externalContactId, input.currentState],
    );

    const row = result.rows[0];
    return {
      id: row.id,
      tenantId: row.tenant_id,
      externalContactId: row.external_contact_id,
      currentState: row.current_state,
    };
  }

  async findByIdOrExternalContact(input: {
    tenantId: string;
    leadId?: string;
    externalContactId?: string;
  }): Promise<LeadRecord | null> {
    const result = await this.pool.query<{
      id: string;
      tenant_id: string;
      external_contact_id: string;
      current_state: string;
    }>(
      `select id, tenant_id, external_contact_id, current_state
       from leads
       where tenant_id = $1
         and (id = $2 or external_contact_id = $3)
       limit 1`,
      [input.tenantId, input.leadId ?? "", input.externalContactId ?? ""],
    );
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id,
      tenantId: row.tenant_id,
      externalContactId: row.external_contact_id,
      currentState: row.current_state,
    };
  }

  async updateState(input: {
    tenantId: string;
    leadId: string;
    currentState: string;
  }): Promise<void> {
    await this.pool.query(
      `update leads set current_state = $1, updated_at = now()
       where tenant_id = $2 and id = $3`,
      [input.currentState, input.tenantId, input.leadId],
    );
  }

  async registerInterest(input: {
    tenantId: string;
    leadId: string;
    product: string;
    notes: string;
  }): Promise<void> {
    await this.pool.query(
      `insert into lead_interests (tenant_id, lead_id, product, notes, created_at)
       values ($1, $2, $3, $4, now())`,
      [input.tenantId, input.leadId, input.product, input.notes],
    );
  }

  async escalateToHuman(input: {
    tenantId: string;
    leadId: string;
    reason: string;
  }): Promise<void> {
    await this.pool.query(
      `insert into lead_escalations (tenant_id, lead_id, reason, created_at)
       values ($1, $2, $3, now())`,
      [input.tenantId, input.leadId, input.reason],
    );
  }
}

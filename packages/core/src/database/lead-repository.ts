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
}

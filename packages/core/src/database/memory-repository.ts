import type pg from "pg";

export interface MemoryRecord {
  id: string;
  tenantId: string;
  leadId: string;
  content: string;
  createdAt: Date;
}

export class MemoryRepository {
  constructor(private readonly pool: pg.Pool) {}

  async append(input: {
    tenantId: string;
    leadId: string;
    content: string;
  }): Promise<void> {
    await this.pool.query(
      `insert into lead_memories (tenant_id, lead_id, content, created_at)
       values ($1, $2, $3, now())`,
      [input.tenantId, input.leadId, input.content],
    );
  }

  async listRecent(input: {
    tenantId: string;
    leadId: string;
    limit?: number;
  }): Promise<MemoryRecord[]> {
    const result = await this.pool.query<{
      id: string;
      tenant_id: string;
      lead_id: string;
      content: string;
      created_at: Date;
    }>(
      `select id, tenant_id, lead_id, content, created_at
       from lead_memories
       where tenant_id = $1 and lead_id = $2
       order by created_at desc
       limit $3`,
      [input.tenantId, input.leadId, input.limit ?? 10],
    );
    return result.rows.map((r) => ({
      id: r.id,
      tenantId: r.tenant_id,
      leadId: r.lead_id,
      content: r.content,
      createdAt: r.created_at,
    }));
  }
}
import type pg from "pg";
import type { PlatformEvent } from "../events/types.js";

export class EventStore {
  constructor(private readonly pool: pg.Pool) {}

  async listByStatus(status: string, limit = 10): Promise<PlatformEvent[]> {
    const result = await this.pool.query<{
      id: string;
      tenant_id: string;
      lead_id: string | null;
      type: PlatformEvent["type"];
      source: string;
      occurred_at: Date;
      payload: Record<string, unknown>;
    }>(
      `select id, tenant_id, lead_id, type, source, occurred_at, payload
       from events
       where status = $1
       order by occurred_at asc
       limit $2`,
      [status, limit],
    );

    return result.rows.map((row) => ({
      id: row.id,
      tenantId: row.tenant_id,
      leadId: row.lead_id ?? undefined,
      type: row.type,
      source: row.source,
      occurredAt: row.occurred_at.toISOString(),
      payload: row.payload,
    }));
  }

  async append(event: PlatformEvent, status = "processed"): Promise<void> {
    await this.pool.query(
      `insert into events (id, tenant_id, lead_id, type, source, occurred_at, payload, status)
       values ($1, $2, $3, $4, $5, $6, $7, $8)
       on conflict (id) do nothing`,
      [
        event.id,
        event.tenantId,
        event.leadId ?? null,
        event.type,
        event.source,
        event.occurredAt,
        JSON.stringify(event.payload),
        status,
      ],
    );
  }

  async updateStatus(eventId: string, status: string): Promise<void> {
    await this.pool.query(`update events set status = $2 where id = $1`, [eventId, status]);
  }
}

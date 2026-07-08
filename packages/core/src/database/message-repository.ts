import type pg from "pg";

export type MessageDirection = "inbound" | "outbound";

export interface MessageRecord {
  id: string;
  tenantId: string;
  leadId: string | null;
  direction: MessageDirection;
  channel: string;
  externalMessageId?: string;
  text: string;
  createdAt: string;
}

export class MessageRepository {
  constructor(private readonly pool: pg.Pool) {}

  async create(input: {
    tenantId: string;
    leadId: string;
    direction: MessageDirection;
    channel: string;
    externalMessageId?: string;
    text: string;
  }): Promise<string> {
    const result = await this.pool.query<{ id: string }>(
      `insert into messages (tenant_id, lead_id, direction, channel, external_message_id, text)
       values ($1, $2, $3, $4, $5, $6)
       returning id`,
      [
        input.tenantId,
        input.leadId,
        input.direction,
        input.channel,
        input.externalMessageId ?? null,
        input.text,
      ],
    );

    return result.rows[0].id;
  }

  async listRecentByLead(input: {
    tenantId: string;
    leadId: string;
    limit: number;
    excludeExternalMessageId?: string;
  }): Promise<MessageRecord[]> {
    const result = await this.pool.query<{
      id: string;
      tenant_id: string;
      lead_id: string | null;
      direction: MessageDirection;
      channel: string;
      external_message_id: string | null;
      text: string;
      created_at: string;
    }>(
      `select id, tenant_id, lead_id, direction, channel, external_message_id, text, created_at
       from (
         select id, tenant_id, lead_id::text as lead_id, direction, channel, external_message_id, text, created_at
         from messages
         where tenant_id = $1
           and lead_id = $2
           and ($4::text is null or external_message_id is distinct from $4)
         order by created_at desc
         limit $3
       ) recent_messages
       order by created_at asc`,
      [input.tenantId, input.leadId, input.limit, input.excludeExternalMessageId ?? null],
    );

    return result.rows.map((row) => ({
      id: row.id,
      tenantId: row.tenant_id,
      leadId: row.lead_id,
      direction: row.direction,
      channel: row.channel,
      externalMessageId: row.external_message_id ?? undefined,
      text: row.text,
      createdAt: row.created_at,
    }));
  }
}

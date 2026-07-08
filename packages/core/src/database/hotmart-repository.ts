import type pg from "pg";
import type { PlatformEvent } from "../events/types.js";

const purchaseEvents = new Set<PlatformEvent["type"]>([
  "PURCHASE_APPROVED",
  "PURCHASE_CREATED",
  "PURCHASE_DELAYED",
  "PURCHASE_EXPIRED",
  "PURCHASE_CANCELED",
  "PURCHASE_REFUNDED",
  "REFUND_REQUESTED",
]);

const subscriptionEvents = new Set<PlatformEvent["type"]>(["SUBSCRIPTION_CREATED", "SUBSCRIPTION_CANCELED"]);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function readPath(payload: Record<string, unknown>, paths: string[][]): unknown {
  for (const path of paths) {
    let current: unknown = payload;
    for (const key of path) {
      current = asRecord(current)[key];
      if (current === undefined || current === null) {
        break;
      }
    }

    if (current !== undefined && current !== null && current !== "") {
      return current;
    }
  }

  return null;
}

function readString(payload: Record<string, unknown>, paths: string[][]): string | null {
  const value = readPath(payload, paths);
  return value === null ? null : String(value);
}

function readDate(payload: Record<string, unknown>, paths: string[][]): string | null {
  const value = readPath(payload, paths);
  if (value === null) {
    return null;
  }

  if (typeof value === "number") {
    return new Date(value).toISOString();
  }

  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function rawPayload(event: PlatformEvent): Record<string, unknown> {
  return asRecord(event.payload.raw);
}

export class HotmartRepository {
  constructor(private readonly pool: pg.Pool) {}

  async persistEvent(event: PlatformEvent): Promise<void> {
    if (purchaseEvents.has(event.type)) {
      await this.upsertPurchase(event);
      return;
    }

    if (subscriptionEvents.has(event.type)) {
      await this.upsertSubscription(event);
    }
  }

  private async upsertPurchase(event: PlatformEvent): Promise<void> {
    const payload = rawPayload(event);
    const transactionId = readString(payload, [
      ["data", "purchase", "transaction"],
      ["data", "purchase", "transaction_id"],
      ["data", "transaction"],
      ["transaction"],
      ["transaction_id"],
    ]);

    if (!transactionId) {
      return;
    }

    await this.pool.query(
      `insert into purchases (
        tenant_id, transaction_id, hotmart_purchase_id, product_id, product_name, buyer_name,
        buyer_email, buyer_phone, status, payment_type, purchase_date, approved_date,
        refunded_date, raw_payload
       )
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       on conflict (tenant_id, transaction_id)
       do update set
        hotmart_purchase_id = coalesce(excluded.hotmart_purchase_id, purchases.hotmart_purchase_id),
        product_id = coalesce(excluded.product_id, purchases.product_id),
        product_name = coalesce(excluded.product_name, purchases.product_name),
        buyer_name = coalesce(excluded.buyer_name, purchases.buyer_name),
        buyer_email = coalesce(excluded.buyer_email, purchases.buyer_email),
        buyer_phone = coalesce(excluded.buyer_phone, purchases.buyer_phone),
        status = coalesce(excluded.status, purchases.status),
        payment_type = coalesce(excluded.payment_type, purchases.payment_type),
        purchase_date = coalesce(excluded.purchase_date, purchases.purchase_date),
        approved_date = coalesce(excluded.approved_date, purchases.approved_date),
        refunded_date = coalesce(excluded.refunded_date, purchases.refunded_date),
        raw_payload = excluded.raw_payload,
        updated_at = now()`,
      [
        event.tenantId,
        transactionId,
        readString(payload, [["data", "purchase", "id"], ["purchase_id"], ["hotmart_purchase_id"]]),
        readString(payload, [["data", "product", "id"], ["product", "id"], ["product_id"]]),
        readString(payload, [["data", "product", "name"], ["product", "name"], ["product_name"]]),
        readString(payload, [["data", "buyer", "name"], ["buyer", "name"], ["buyer_name"]]),
        readString(payload, [["data", "buyer", "email"], ["buyer", "email"], ["buyer_email"]]),
        readString(payload, [["data", "buyer", "phone"], ["buyer", "phone"], ["buyer_phone"]]),
        readString(payload, [["data", "purchase", "status"], ["status"]]) ?? event.type,
        readString(payload, [["data", "purchase", "payment", "type"], ["data", "purchase", "payment_type"], ["payment_type"]]),
        readDate(payload, [["data", "purchase", "order_date"], ["data", "purchase", "date"], ["purchase_date"]]),
        readDate(payload, [["data", "purchase", "approved_date"], ["approved_date"]]),
        readDate(payload, [["data", "purchase", "refunded_date"], ["refunded_date"]]),
        JSON.stringify(payload),
      ],
    );
  }

  private async upsertSubscription(event: PlatformEvent): Promise<void> {
    const payload = rawPayload(event);
    const subscriptionId = readString(payload, [
      ["data", "subscription", "subscriber", "code"],
      ["data", "subscription", "id"],
      ["subscription_id"],
    ]);

    if (!subscriptionId) {
      return;
    }

    await this.pool.query(
      `insert into subscriptions (
        tenant_id, subscription_id, status, plan, next_charge_date, canceled_at, raw_payload
       )
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (tenant_id, subscription_id)
       do update set
        status = coalesce(excluded.status, subscriptions.status),
        plan = coalesce(excluded.plan, subscriptions.plan),
        next_charge_date = coalesce(excluded.next_charge_date, subscriptions.next_charge_date),
        canceled_at = coalesce(excluded.canceled_at, subscriptions.canceled_at),
        raw_payload = excluded.raw_payload,
        updated_at = now()`,
      [
        event.tenantId,
        subscriptionId,
        readString(payload, [["data", "subscription", "status"], ["status"]]) ?? event.type,
        readString(payload, [["data", "subscription", "plan", "name"], ["data", "subscription", "plan"], ["plan"]]),
        readDate(payload, [["data", "subscription", "next_charge_date"], ["next_charge_date"]]),
        readDate(payload, [["data", "subscription", "canceled_at"], ["canceled_at"]]),
        JSON.stringify(payload),
      ],
    );
  }
}

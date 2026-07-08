import "dotenv/config";
import crypto from "node:crypto";
import express from "express";
import {
  EventProcessor,
  EventStore,
  HotmartRepository,
  LeadRepository,
  MessageRepository,
  createAIProvider,
  createPaymentProvider,
  createPostgresPool,
  createWhatsAppProvider,
  loadPlatformConfig,
  type PlatformEvent,
} from "../../../packages/core/src/index.js";

const rootDir = process.cwd();
const platformConfig = loadPlatformConfig(rootDir);
const aiProvider = createAIProvider(platformConfig);
const whatsAppProvider = createWhatsAppProvider(platformConfig);
const paymentProvider = createPaymentProvider();
const pool = createPostgresPool(platformConfig.database.url);
const eventStore = new EventStore(pool);
const hotmartRepository = new HotmartRepository(pool);
const leadRepository = new LeadRepository(pool);
const messageRepository = new MessageRepository(pool);
const processor = new EventProcessor({
  rootDir,
  platformConfig,
  aiProvider,
  whatsAppProvider,
  eventStore,
  hotmartRepository,
  leadRepository,
  messageRepository,
});

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/", (_req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Projeto Camila API</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #1f2937; }
          code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
          .ok { color: #047857; font-weight: 700; }
        </style>
      </head>
      <body>
        <h1>Projeto Camila API</h1>
        <p class="ok">API rodando com sucesso.</p>
        <p>Healthcheck: <code>GET /health</code></p>
        <p>Webhook de mensagem: <code>POST /webhooks/camila-quindere/message</code></p>
      </body>
    </html>
  `);
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    environment: platformConfig.environment,
    aiProvider: platformConfig.providers.ai.provider,
    whatsappProvider: platformConfig.providers.whatsapp.provider,
  });
});

app.post("/webhooks/:tenantId/message", async (req, res, next) => {
  try {
    const tenantId = req.params.tenantId;
    const body = req.body as {
      externalContactId: string;
      messageId?: string;
      text: string;
      channel?: "whatsapp" | "instagram" | "telegram" | "webchat";
      raw?: unknown;
    };

    const event: PlatformEvent = {
      id: crypto.randomUUID(),
      type: "MESSAGE_RECEIVED",
      tenantId,
      source: body.channel ?? "whatsapp",
      occurredAt: new Date().toISOString(),
      payload: {
        externalContactId: body.externalContactId,
        messageId: body.messageId ?? crypto.randomUUID(),
        text: body.text,
        channel: body.channel ?? "whatsapp",
        raw: body.raw ?? body,
      },
    };

    await eventStore.append(event, "received");
    res.status(202).json({ ok: true, eventId: event.id });
  } catch (error) {
    next(error);
  }
});

async function handleHotmartWebhook(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const tenantId = req.params.tenantId;
    const event = paymentProvider.normalizeWebhook(tenantId, req.body as Record<string, unknown>);

    if (!event) {
      res.status(202).json({ ok: true, ignored: true });
      return;
    }

    await processor.process(event);
    res.status(202).json({ ok: true, eventId: event.id, eventType: event.type });
  } catch (error) {
    next(error);
  }
}

app.post("/webhooks/:tenantId/platform/hotmart", handleHotmartWebhook);
app.post("/webhooks/:tenantId/hotmart", handleHotmartWebhook);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ ok: false, error: error.message });
});

const port = Number(process.env.PORT ?? 3333);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

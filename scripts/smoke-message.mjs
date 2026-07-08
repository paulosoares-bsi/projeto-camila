import crypto from "node:crypto";
import {
  EventProcessor,
  EventStore,
  LeadRepository,
  MessageRepository,
  createAIProvider,
  createPostgresPool,
  createWhatsAppProvider,
  loadPlatformConfig,
} from "../packages/core/src/index.ts";

const rootDir = process.cwd();
const platformConfig = loadPlatformConfig(rootDir);
const pool = createPostgresPool(platformConfig.database.url);
const eventStore = new EventStore(pool);
const leadRepository = new LeadRepository(pool);
const messageRepository = new MessageRepository(pool);

const processor = new EventProcessor({
  rootDir,
  platformConfig,
  aiProvider: createAIProvider(platformConfig),
  whatsAppProvider: createWhatsAppProvider(platformConfig),
  eventStore,
  leadRepository,
  messageRepository,
});

const event = {
  id: crypto.randomUUID(),
  type: "MESSAGE_RECEIVED",
  tenantId: "camila-quindere",
  source: "whatsapp",
  occurredAt: new Date().toISOString(),
  payload: {
    externalContactId: "5585999999999",
    messageId: "test-001",
    text: "Oi, queria saber o valor da mentoria",
    channel: "whatsapp",
  },
};

try {
  await processor.process(event);
  console.log(`Smoke message processed: ${event.id}`);
} finally {
  await pool.end();
}

import "dotenv/config";
import {
  EventProcessor,
  EventStore,
  HotmartRepository,
  LeadRepository,
  MessageRepository,
  createAIProvider,
  createPostgresPool,
  createWhatsAppProvider,
  loadPlatformConfig,
} from "../../../packages/core/src/index.js";

const rootDir = process.cwd();
const platformConfig = loadPlatformConfig(rootDir);
const pool = createPostgresPool(platformConfig.database.url);
const eventStore = new EventStore(pool);
const processor = new EventProcessor({
  rootDir,
  platformConfig,
  aiProvider: createAIProvider(platformConfig),
  whatsAppProvider: createWhatsAppProvider(platformConfig),
  eventStore,
  hotmartRepository: new HotmartRepository(pool),
  leadRepository: new LeadRepository(pool),
  messageRepository: new MessageRepository(pool),
});

async function processReceivedEvents(): Promise<void> {
  const events = await eventStore.listByStatus("received", 10);

  for (const event of events) {
    await eventStore.updateStatus(event.id, "processing");
    await processor.process(event);
    console.log(`Processed event ${event.id}`);
  }
}

const once = process.argv.includes("--once");

try {
  if (once) {
    await processReceivedEvents();
    await pool.end();
  } else {
    console.log("Worker listening for received events.");
    setInterval(() => {
      processReceivedEvents().catch((error: unknown) => {
        console.error(error);
      });
    }, 5000);
  }
} catch (error) {
  await pool.end();
  throw error;
}

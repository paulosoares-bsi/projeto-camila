import crypto from "node:crypto";
import fs from "node:fs";
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
const apiBaseUrl = `http://localhost:${process.env.PORT ?? 3333}`;

// ---------------------------------------------------------------------------
// 1. Pré-checagem de infraestrutura (antes de enviar qualquer mensagem)
// ---------------------------------------------------------------------------
async function checkInfra() {
  console.log("=== INFRAESTRUTURA ===");

  // Postgres
  const pool = createPostgresPool(platformConfig.database.url);
  let postgresOk = false;
  try {
    await pool.query("select 1");
    postgresOk = true;
  } catch (error) {
    console.error("Postgres: FALHOU", error.message);
  } finally {
    await pool.end();
  }
  console.log(`Postgres: ${postgresOk ? "OK" : "FALHOU"}`);

  // API + provider de IA configurado
  let apiOk = false;
  let aiProvider = "?";
  try {
    const res = await fetch(`${apiBaseUrl}/health`);
    if (res.ok) {
      const health = await res.json();
      apiOk = true;
      aiProvider = health.aiProvider;
    }
  } catch (error) {
    console.error("API: FALHOU", error.message);
  }
  console.log(`API: ${apiOk ? "OK" : "FALHOU"} (aiProvider=${aiProvider})`);

  const infraOk = postgresOk && apiOk && aiProvider === "openrouter";
  if (!infraOk) {
    console.error("\nINFRAESTRUTURA INSUFICIENTE — abortando smoke test.");
    process.exit(1);
  }
  console.log("Infraestrutura OK\n");
}

// ---------------------------------------------------------------------------
// 2. Leitura dos cenários a partir de requests/openrouter.http
//    (os dados ficam no .http; a lógica fica aqui)
// ---------------------------------------------------------------------------
function loadScenarios() {
  const raw = fs.readFileSync(
    new URL("../requests/openrouter.http", import.meta.url),
    "utf8",
  );
  const blocks = raw.split("###").slice(1); // ignora o que vem antes do 1º ###
  const scenarios = [];
  for (const block of blocks) {
    const start = block.indexOf("{");
    const end = block.lastIndexOf("}");
    if (start === -1 || end === -1) continue;
    try {
      const body = JSON.parse(block.slice(start, end + 1));
      if (body.externalContactId && body.text) {
        scenarios.push({
          externalContactId: body.externalContactId,
          messageId: body.messageId ?? crypto.randomUUID(),
          text: body.text,
          channel: body.channel ?? "whatsapp",
        });
      }
    } catch {
      // bloco sem JSON válido — ignora
    }
  }
  return scenarios;
}

// ---------------------------------------------------------------------------
// 3. Execução (um único cenário aleatório)
// ---------------------------------------------------------------------------
await checkInfra();

const scenarios = loadScenarios();
if (scenarios.length === 0) {
  console.error("Nenhum cenário encontrado em requests/openrouter.http");
  process.exit(1);
}

const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
console.log("=== ATORES ===");
console.log(
  `tenant=camila-quindere | provider=openrouter | modelo=${platformConfig.providers.ai.model} | canal=whatsapp(mock)\n`,
);

const pool = createPostgresPool(platformConfig.database.url);
const eventStore = new EventStore(pool);
const leadRepository = new LeadRepository(pool);
const messageRepository = new MessageRepository(pool);

// Capturador: decoramos o WhatsApp provider para registrar a resposta da IA
let aiResponse = "";
const baseWhatsApp = createWhatsAppProvider(platformConfig);
const capturingWhatsApp = {
  async sendMessage(input) {
    aiResponse = input.text;
    return baseWhatsApp.sendMessage(input);
  },
};

const processor = new EventProcessor({
  rootDir,
  platformConfig,
  aiProvider: createAIProvider(platformConfig),
  whatsAppProvider: capturingWhatsApp,
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
    externalContactId: scenario.externalContactId,
    messageId: scenario.messageId,
    text: scenario.text,
    channel: scenario.channel,
  },
};

console.log(`--- Cenário (lead ${scenario.externalContactId}) ---`);
console.log("ENTRADA");
console.log(
  JSON.stringify(
    {
      externalContactId: scenario.externalContactId,
      messageId: scenario.messageId,
      text: scenario.text,
      channel: scenario.channel,
    },
    null,
    2,
  ),
);

try {
  await processor.process(event);
} catch (error) {
  console.error(`\nERRO: ${error.message}`);
  await pool.end();
  console.error("\n=== RESULTADO ===");
  console.error("SMOKE TEST: FALHOU");
  process.exit(1);
}

console.log(`\nSAÍDA: \n${aiResponse}\n`);

// ---------------------------------------------------------------------------
// 4. Verificação real no banco (SQL) — confirma persistência
// ---------------------------------------------------------------------------
console.log("BANCO:");
let bankOk = true;

const eventRow = await pool
  .query(`select id, occurred_at from events where id = $1`, [event.id])
  .then((r) => r.rows[0])
  .catch(() => undefined);

if (!eventRow) {
  console.log(`event id: ${event.id} (NÃO ENCONTRADO NA TABELA events)`);
  bankOk = false;
} else {
  console.log(`event id: ${eventRow.id}`);
  console.log(`occurred_at: ${eventRow.occurred_at}`);
}

const leadRow = await pool
  .query(
    `select id from leads where tenant_id = $1 and external_contact_id = $2`,
    ["camila-quindere", scenario.externalContactId],
  )
  .then((r) => r.rows[0])
  .catch(() => undefined);

if (!leadRow) {
  console.log(`lead id: ${scenario.externalContactId} (NÃO ENCONTRADO NA TABELA leads)`);
  bankOk = false;
} else {
  console.log(`lead id: ${leadRow.id}`);
}

await pool.end();

if (!bankOk) {
  console.error("\n=== RESULTADO ===");
  console.error("SMOKE TEST: FALHOU (dados não persistidos no banco)");
  process.exit(1);
}

console.log("=== RESULTADO ===");
console.log(
  "SMOKE TEST: PASSOU (mensagem recebida, processada pela IA OpenRouter e dados gravados no banco)",
);
process.exit(0);
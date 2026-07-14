import fs from "node:fs";
import path from "node:path";
import type { TenantContext } from "../tenants/tenant-loader.js";
import type { Tool, ToolContext, ToolRegistry } from "./tool.js";

export function registerKnowledgeTools(
  registry: ToolRegistry,
  rootDir: string,
  tenantId: string,
  tenant: TenantContext,
): void {
  registry.register({
    name: "consultar_produto",
    description: "Consulta o catálogo de produtos/mentorias do tenant.",
    parameters: {
      type: "object",
      properties: {
        termo: { type: "string", description: "Termo de busca opcional" },
      },
    },
    async execute(args) {
      const productsPath = path.join(rootDir, "tenants", tenantId, "products", "products.yaml");
      if (!fs.existsSync(productsPath)) {
        return { ok: false, error: "Catálogo de produtos não encontrado" };
      }
      const content = fs.readFileSync(productsPath, "utf8");
      const termo = (args.termo as string)?.toLowerCase();
      if (termo) {
        const lines = content.split("\n").filter((l) => l.toLowerCase().includes(termo));
        return { ok: true, data: lines.join("\n") || "Nenhum produto encontrado" };
      }
      return { ok: true, data: content };
    },
  });

  registry.register({
    name: "consultar_knowledge_base",
    description: "Consulta a base de conhecimento do tenant para responder dúvidas.",
    parameters: {
      type: "object",
      properties: {
        topico: { type: "string", description: "Tópico ou palavra-chave" },
      },
      required: ["topico"],
    },
    async execute(args) {
      const topico = (args.topico as string)?.toLowerCase();
      if (!topico) return { ok: false, error: "topico obrigatório" };
      const kb = tenant.knowledge;
      const lines = kb.split("\n").filter((l) => l.toLowerCase().includes(topico));
      const excerpt = lines.length ? lines.join("\n") : kb.slice(0, 2000);
      return { ok: true, data: excerpt };
    },
  });
}
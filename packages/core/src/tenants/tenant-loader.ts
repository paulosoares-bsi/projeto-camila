import fs from "node:fs";
import type { TenantConfig } from "../config/types.js";
import { loadTenantConfig, resolveTenantPath } from "../config/load-config.js";

export interface TenantContext {
  config: TenantConfig;
  knowledge: string;
  systemPrompt: string;
}

export function loadTenantContext(rootDir: string, tenantId: string): TenantContext {
  const config = loadTenantConfig(rootDir, tenantId);
  const knowledge = fs.readFileSync(resolveTenantPath(rootDir, tenantId, config.knowledge.main), "utf8");
  const systemPrompt = fs.readFileSync(resolveTenantPath(rootDir, tenantId, config.prompts.system), "utf8");

  return {
    config,
    knowledge,
    systemPrompt,
  };
}

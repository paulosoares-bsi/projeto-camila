import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import type { PlatformConfig, TenantConfig } from "./types.js";

const envPattern = /\$\{([A-Z0-9_]+)\}/g;

function readYamlFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf8");
  const expanded = raw.replace(envPattern, (_, key: string) => process.env[key] ?? "");
  return YAML.parse(expanded) as T;
}

export function loadPlatformConfig(rootDir: string): PlatformConfig {
  return readYamlFile<PlatformConfig>(path.join(rootDir, "config", "platform.config.yaml"));
}

export function loadTenantConfig(rootDir: string, tenantId: string): TenantConfig {
  return readYamlFile<TenantConfig>(path.join(rootDir, "tenants", tenantId, "tenant.yaml"));
}

export function resolveTenantPath(rootDir: string, tenantId: string, relativePath: string): string {
  return path.join(rootDir, "tenants", tenantId, relativePath);
}

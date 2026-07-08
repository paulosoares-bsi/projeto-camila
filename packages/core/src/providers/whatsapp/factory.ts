import type { PlatformConfig } from "../../config/types.js";
import { EvolutionWhatsAppProvider } from "./evolution-provider.js";
import { MockWhatsAppProvider } from "./mock-provider.js";
import type { WhatsAppProvider } from "./types.js";

export function createWhatsAppProvider(config: PlatformConfig): WhatsAppProvider {
  const provider = config.providers.whatsapp;

  if (provider.provider === "evolution") {
    return new EvolutionWhatsAppProvider(provider.baseUrl ?? "", provider.apiKey);
  }

  return new MockWhatsAppProvider();
}

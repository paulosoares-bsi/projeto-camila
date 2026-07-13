import type { PlatformConfig } from "../../config/types.js";
import type { AIProvider } from "./types.js";
import { AnthropicProvider } from "./anthropic-provider.js";
import { MockAIProvider } from "./mock-provider.js";
import { OpenAIProvider } from "./openai-provider.js";
import { OllamaProvider } from "./ollama-provider.js";
import { OpenRouterProvider } from "./openrouter-provider.js";

export function createAIProvider(config: PlatformConfig): AIProvider {
  const provider = config.providers.ai;

  if (provider.provider === "openai") {
    return new OpenAIProvider(provider.model, provider.apiKey);
  }

  if (provider.provider === "anthropic") {
    return new AnthropicProvider(provider.model, provider.apiKey);
  }

  if (provider.provider === "ollama") {
    return new OllamaProvider(provider.model, provider.baseUrl);
  }
  if (provider.provider === "openrouter") {
    return new OpenRouterProvider(provider.model, provider.apiKey);
  }

  return new MockAIProvider();
}

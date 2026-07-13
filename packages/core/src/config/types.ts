export type ProviderName =
  | "openai"
  | "anthropic"
  | "ollama"
  | "evolution"
  | "n8n"
  | "hotmart"
  | "mock"
  | "openrouter";

export interface PlatformConfig {
  environment: string;
  database: {
    provider: "postgres";
    url: string;
  };
  automation: {
    provider: "n8n";
    baseUrl: string;
  };
  providers: {
    ai: {
      provider: Extract<ProviderName, "openai" | "anthropic" | "ollama" | "mock" | "openrouter">;
      model: string;
      apiKey?: string;
      baseUrl?: string;
    };
    whatsapp: {
      provider: Extract<ProviderName, "evolution" | "mock">;
      baseUrl?: string;
      apiKey?: string;
      defaultInstance?: string;
    };
    webhooks: {
      provider: Extract<ProviderName, "n8n" | "mock">;
      signingSecret?: string;
    };
    payments: {
      provider: Extract<ProviderName, "hotmart" | "mock">;
    };
  };
}

export interface TenantConfig {
  id: string;
  name: string;
  status: "active" | "inactive";
  defaultLanguage: string;
  timezone: string;
  providers?: {
    whatsapp?: {
      instance?: string;
    };
  };
  knowledge: {
    main: string;
  };
  rules: {
    main: string;
  };
  playbooks: string[];
  prompts: {
    system: string;
  };
  products: {
    main: string;
  };
}
export type ProviderName = "openai" | "anthropic" | "evolution" | "n8n" | "hotmart" | "mock";

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
      provider: "openai" | "anthropic" | "mock";
      model: string;
      apiKey?: string;
    };
    whatsapp: {
      provider: "evolution" | "mock";
      baseUrl?: string;
      apiKey?: string;
      defaultInstance?: string;
    };
    webhooks: {
      provider: "n8n" | "mock";
      signingSecret?: string;
    };
    payments: {
      provider: "hotmart" | "mock";
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

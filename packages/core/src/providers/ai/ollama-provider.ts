import type { AIProvider, GenerateResponseInput, GenerateResponseOutput } from "./types.js";

interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OllamaChatResponse {
  message?: {
    role?: string;
    content?: string;
  };
}

export class OllamaProvider implements AIProvider {
  private readonly baseUrl: string;

  constructor(
    private readonly model: string,
    baseUrl?: string,
  ) {
    this.baseUrl = (baseUrl ?? "http://localhost:11434").replace(/\/$/, "");
  }

  async generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
    const messages: OllamaChatMessage[] = [
      {
        role: "system",
        content: `${input.systemPrompt}\n\nResponda apenas em JSON válido.`,
      },
      {
        role: "user",
        content: `${input.context}\n\nMensagem da lead:\n${input.userMessage}`,
      },
    ];

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
        think: false,
        format: "json",
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with status ${response.status}`);
    }

    const data = (await response.json()) as OllamaChatResponse;

    return {
      text: data.message?.content ?? "",
      model: this.model,
      provider: "ollama",
    };
  }
}

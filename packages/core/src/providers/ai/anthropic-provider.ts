import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider, GenerateResponseInput, GenerateResponseOutput } from "./types.js";

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;

  constructor(
    private readonly model: string,
    apiKey?: string,
  ) {
    this.client = new Anthropic({ apiKey });
  }

  async generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 900,
      system: input.systemPrompt,
      messages: [
        {
          role: "user",
          content: `${input.context}\n\nMensagem da lead:\n${input.userMessage}`,
        },
      ],
    });

    const first = response.content[0];
    const text = first?.type === "text" ? first.text : "";

    return {
      text,
      model: this.model,
      provider: "anthropic",
    };
  }
}

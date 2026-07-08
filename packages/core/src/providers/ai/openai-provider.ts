import OpenAI from "openai";
import type { AIProvider, GenerateResponseInput, GenerateResponseOutput } from "./types.js";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(
    private readonly model: string,
    apiKey?: string,
  ) {
    this.client = new OpenAI({ apiKey });
  }

  async generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: input.systemPrompt },
        { role: "user", content: `${input.context}\n\nMensagem da lead:\n${input.userMessage}` },
      ],
    });

    return {
      text: response.choices[0]?.message?.content ?? "",
      model: this.model,
      provider: "openai",
    };
  }
}

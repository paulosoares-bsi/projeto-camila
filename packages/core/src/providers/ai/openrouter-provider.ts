import OpenAI from "openai";
import type { AIProvider, GenerateResponseInput, GenerateResponseOutput } from "./types.js";

/**
 * OpenRouterProvider – a thin wrapper around the OpenAI SDK pointing to the OpenRouter endpoint.
 * The API key is read from the OPENROUTER_API_KEY environment variable (no secret in code).
 */
export class OpenRouterProvider implements AIProvider {
  private client: OpenAI;

  constructor(
    private readonly model: string = "openrouter/free",
    private readonly apiKey: string = process.env.OPENROUTER_API_KEY ?? "",
  ) {
    // OpenRouter is OpenAI‑compatible; we only need to set the base URL.
    this.client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });
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
      provider: "openrouter",
    };
  }
}
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
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: input.systemPrompt },
      { role: "user", content: `${input.context}\n\nMensagem da lead:\n${input.userMessage}` },
    ];

    if (input.toolResults?.length) {
      for (const tr of input.toolResults) {
        messages.push({
          role: "tool",
          tool_call_id: tr.toolCallId,
          content: JSON.stringify(tr.output),
        });
      }
    }

    const tools = input.tools?.map((t) => ({
      type: "function" as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      },
    }));

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      ...(tools?.length ? { tools, tool_choice: "auto" as const } : {}),
    });

    const message = response.choices[0]?.message;
    const toolCalls = message?.tool_calls?.map((tc) => ({
      id: tc.id,
      name: tc.function.name,
      arguments: JSON.parse(tc.function.arguments || "{}"),
    }));

    return {
      text: message?.content ?? "",
      model: this.model,
      provider: "openrouter",
      toolCalls: toolCalls?.length ? toolCalls : undefined,
    };
  }
}
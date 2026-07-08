import type { AIProvider, GenerateResponseInput, GenerateResponseOutput } from "./types.js";

export class MockAIProvider implements AIProvider {
  async generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
    console.log("==================== PROMPT ====================");
    console.log(input.prompt);
    console.log("================================================");

    return {
      text: `Recebi sua mensagem e vou te ajudar com calma. Contexto do tenant: ${input.tenantId}.`,
      model: "mock",
      provider: "mock",
    };
  }
}

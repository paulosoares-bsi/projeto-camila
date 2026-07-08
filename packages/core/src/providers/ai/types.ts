export interface GenerateResponseInput {
  tenantId: string;
  prompt: string;
  systemPrompt: string;
  context: string;
  userMessage: string;
}

export interface GenerateResponseOutput {
  text: string;
  model: string;
  provider: string;
}

export interface AIProvider {
  generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput>;
}

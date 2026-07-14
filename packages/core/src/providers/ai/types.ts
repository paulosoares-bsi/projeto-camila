export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface GenerateResponseInput {
  tenantId: string;
  prompt: string;
  systemPrompt: string;
  context: string;
  userMessage: string;
  tools?: ToolDefinition[];
  toolResults?: { toolCallId: string; output: unknown }[];
}

export interface GenerateResponseOutput {
  text: string;
  model: string;
  provider: string;
  toolCalls?: ToolCall[];
}

export interface AIProvider {
  generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput>;
}

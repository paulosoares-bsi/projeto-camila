import type { IncomingMessagePayload, PlatformEvent } from "../events/types.js";

export interface RuleDecision {
  appliedRuleIds: string[];
  nextState: string;
  playbookId?: string;
  needsHumanHandoff: boolean;
}

function detectIntent(text: string): "PRICE_REQUESTED" | "UNKNOWN" {
  const normalized = text.toLowerCase();
  const priceTerms = ["preco", "preço", "valor", "quanto custa", "investimento"];
  return priceTerms.some((term) => normalized.includes(term)) ? "PRICE_REQUESTED" : "UNKNOWN";
}

export function evaluateRules(event: PlatformEvent): RuleDecision {
  if (event.type !== "MESSAGE_RECEIVED") {
    return {
      appliedRuleIds: [],
      nextState: "UNCHANGED",
      needsHumanHandoff: false,
    };
  }

  const payload = event.payload as unknown as IncomingMessagePayload;
  const text = payload.text ?? "";
  const intent = detectIntent(text);

  if (intent === "PRICE_REQUESTED") {
    return {
      appliedRuleIds: ["BR-SALES-001"],
      nextState: "LEAD_QUENTE",
      playbookId: "PB-SALES-PRICE",
      needsHumanHandoff: false,
    };
  }

  return {
    appliedRuleIds: ["BR-LEAD-001"],
    nextState: "NOVO",
    playbookId: "PB-SALES-INITIAL",
    needsHumanHandoff: false,
  };
}

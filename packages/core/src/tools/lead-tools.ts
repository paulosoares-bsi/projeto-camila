import type { LeadRepository } from "../database/lead-repository.js";
import type { Tool, ToolContext, ToolRegistry } from "./tool.js";

export function registerLeadTools(registry: ToolRegistry, leadRepository: LeadRepository): void {
  registry.register({
    name: "buscar_lead",
    description: "Busca os dados de um lead pelo ID ou contato externo.",
    parameters: {
      type: "object",
      properties: {
        leadId: { type: "string" },
        externalContactId: { type: "string" },
      },
    },
    async execute(args, ctx: ToolContext) {
      const id = (args.leadId as string) ?? ctx.leadId;
      if (!id && !args.externalContactId && !ctx.externalContactId) {
        return { ok: false, error: "leadId ou externalContactId obrigatório" };
      }
      const result = await leadRepository.findByIdOrExternalContact({
        tenantId: ctx.tenantId,
        leadId: id,
        externalContactId: (args.externalContactId as string) ?? ctx.externalContactId,
      });
      return result ? { ok: true, data: result } : { ok: false, error: "Lead não encontrado" };
    },
  });

  registry.register({
    name: "atualizar_lead",
    description: "Atualiza o estado ou dados de um lead.",
    parameters: {
      type: "object",
      properties: {
        leadId: { type: "string" },
        currentState: { type: "string" },
      },
      required: ["leadId"],
    },
    async execute(args, ctx: ToolContext) {
      const id = (args.leadId as string) ?? ctx.leadId;
      if (!id) return { ok: false, error: "leadId obrigatório" };
      await leadRepository.updateState({
        tenantId: ctx.tenantId,
        leadId: id,
        currentState: args.currentState as string,
      });
      return { ok: true, data: { leadId: id, currentState: args.currentState } };
    },
  });

  registry.register({
    name: "registrar_interesse",
    description: "Registra interesse de um lead em um produto ou mentoria.",
    parameters: {
      type: "object",
      properties: {
        leadId: { type: "string" },
        produto: { type: "string" },
        observacoes: { type: "string" },
      },
      required: ["leadId", "produto"],
    },
    async execute(args, ctx: ToolContext) {
      const id = (args.leadId as string) ?? ctx.leadId;
      if (!id) return { ok: false, error: "leadId obrigatório" };
      await leadRepository.registerInterest({
        tenantId: ctx.tenantId,
        leadId: id,
        product: args.produto as string,
        notes: (args.observacoes as string) ?? "",
      });
      return { ok: true, data: { leadId: id, produto: args.produto } };
    },
  });

  registry.register({
    name: "escalar_humano",
    description: "Escalona o atendimento para um humano da equipe.",
    parameters: {
      type: "object",
      properties: {
        leadId: { type: "string" },
        motivo: { type: "string" },
      },
      required: ["leadId"],
    },
    async execute(args, ctx: ToolContext) {
      const id = (args.leadId as string) ?? ctx.leadId;
      if (!id) return { ok: false, error: "leadId obrigatório" };
      await leadRepository.escalateToHuman({
        tenantId: ctx.tenantId,
        leadId: id,
        reason: (args.motivo as string) ?? "Solicitado pela IA",
      });
      return { ok: true, data: { leadId: id, escalado: true } };
    },
  });
}
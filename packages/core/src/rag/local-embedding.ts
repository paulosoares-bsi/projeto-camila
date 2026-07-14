import type { EmbeddingProvider } from "./rag.js";

/**
 * EmbeddingProvider local determinístico (sem dependências externas).
 * Gera vetor de dimensão fixa baseado em hashing de tokens.
 * Adequado para desenvolvimento e testes; produção deve usar provider real.
 */
export class LocalEmbeddingProvider implements EmbeddingProvider {
  private readonly dim: number;
  constructor(dim = 256) {
    this.dim = dim;
  }

  async embed(text: string): Promise<number[]> {
    const vec = new Array(this.dim).fill(0);
    const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
    for (const token of tokens) {
      let h = 0;
      for (let i = 0; i < token.length; i++) {
        h = (h * 31 + token.charCodeAt(i)) >>> 0;
      }
      vec[h % this.dim] += 1;
    }
    const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
    return vec.map((v) => v / norm);
  }
}
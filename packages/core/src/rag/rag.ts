import fs from "node:fs";
import path from "node:path";

export interface Chunk {
  id: string;
  text: string;
  embedding: number[];
}

export interface RetrievalResult {
  chunk: Chunk;
  score: number;
}

/**
 * RAG simples baseado em similaridade de cosseno.
 * Embeddings são gerados por um provedor injetável.
 */
export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
}

export class RagStore {
  private chunks: Chunk[] = [];

  constructor(private readonly embeddingProvider: EmbeddingProvider) {}

  async indexDirectory(dir: string): Promise<void> {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".txt"));
    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), "utf8");
      const parts = content.split(/\n{2,}/).map((p) => p.trim()).filter((p) => p.length > 20);
      for (let i = 0; i < parts.length; i++) {
        const embedding = await this.embeddingProvider.embed(parts[i]);
        this.chunks.push({ id: `${file}:${i}`, text: parts[i], embedding });
      }
    }
  }

  async retrieve(query: string, topK = 3): Promise<RetrievalResult[]> {
    const qEmbed = await this.embeddingProvider.embed(query);
    return this.chunks
      .map((chunk) => ({ chunk, score: cosine(qEmbed, chunk.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}
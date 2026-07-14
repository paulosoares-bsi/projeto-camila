export interface MetricSnapshot {
  counters: Record<string, number>;
  timers: Record<string, number[]>;
}

/**
 * Coletor de métricas em memória (leve, sem dependências).
 * Adequado para observabilidade básica; produção pode exportar para Prometheus.
 */
export class Metrics {
  private counters = new Map<string, number>();
  private timers = new Map<string, number[]>();

  increment(name: string, by = 1): void {
    this.counters.set(name, (this.counters.get(name) ?? 0) + by);
  }

  time(name: string, ms: number): void {
    const arr = this.timers.get(name) ?? [];
    arr.push(ms);
    this.timers.set(name, arr);
  }

  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      return await fn();
    } finally {
      this.time(name, Date.now() - start);
    }
  }

  snapshot(): MetricSnapshot {
    return {
      counters: Object.fromEntries(this.counters),
      timers: Object.fromEntries(this.timers),
    };
  }
}
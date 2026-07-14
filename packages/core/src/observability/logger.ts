export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  ts: string;
  level: LogLevel;
  scope: string;
  message: string;
  meta?: Record<string, unknown>;
}

export class Logger {
  constructor(private readonly scope: string) {}

  private emit(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    const entry: LogEntry = {
      ts: new Date().toISOString(),
      level,
      scope: this.scope,
      message,
      ...(meta ? { meta } : {}),
    };
    if (level === "error") {
      console.error(JSON.stringify(entry));
    } else if (level === "warn") {
      console.warn(JSON.stringify(entry));
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.emit("debug", message, meta);
  }
  info(message: string, meta?: Record<string, unknown>): void {
    this.emit("info", message, meta);
  }
  warn(message: string, meta?: Record<string, unknown>): void {
    this.emit("warn", message, meta);
  }
  error(message: string, meta?: Record<string, unknown>): void {
    this.emit("error", message, meta);
  }
}
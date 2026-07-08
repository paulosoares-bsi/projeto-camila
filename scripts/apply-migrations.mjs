import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const pool = new pg.Pool({ connectionString: databaseUrl });
const migrationsDir = path.join(process.cwd(), "database", "migrations");
const files = fs.readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")).sort();

try {
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);
    console.log(`Applied migration: ${file}`);
  }
} finally {
  await pool.end();
}

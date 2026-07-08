import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const target = new URL(databaseUrl);
const databaseName = target.pathname.replace(/^\//, "");

if (!databaseName) {
  throw new Error("DATABASE_URL must include a database name.");
}

target.pathname = "/postgres";

const pool = new pg.Pool({ connectionString: target.toString() });

try {
  await pool.query(`create database "${databaseName.replaceAll('"', '""')}"`);
  console.log(`Database created: ${databaseName}`);
} catch (error) {
  if (error instanceof Error && error.message.includes("already exists")) {
    console.log(`Database already exists: ${databaseName}`);
  } else {
    throw error;
  }
} finally {
  await pool.end();
}

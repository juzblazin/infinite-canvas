import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pg from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(71309201)");
    await client.query("CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
    const directory = new URL("../migrations/", import.meta.url);
    for (const name of (await readdir(directory)).filter((name) => name.endsWith(".sql")).sort()) {
        const existing = await client.query("SELECT name FROM schema_migrations WHERE name = $1", [name]);
        if (existing.rowCount) continue;
        await client.query(await readFile(fileURLToPath(new URL(name, directory)), "utf8"));
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [name]);
        console.log(`Applied ${name}`);
    }
    await client.query("COMMIT");
    console.log("Migrations complete");
} catch (error) {
    await client.query("ROLLBACK");
    throw error;
} finally {
    await client.end();
}

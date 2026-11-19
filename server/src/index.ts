import { Hono } from "hono";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

type Bindings = {
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
};

const googleEnabled = (env: Bindings) => Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);

function createAuth(env: Bindings, pool: Pool) {
    return betterAuth({
        database: pool,
        secret: env.BETTER_AUTH_SECRET,
        baseURL: env.BETTER_AUTH_URL,
        emailAndPassword: { enabled: true },
        socialProviders: googleEnabled(env) ? {
            google: { clientId: env.GOOGLE_CLIENT_ID!, clientSecret: env.GOOGLE_CLIENT_SECRET! },
        } : {},
        databaseHooks: {
            user: {
                create: {
                    after: async (user) => {
                        try {
                            const client = await pool.connect();
                            try {
                                await client.query("BEGIN");
                                const workspaceId = crypto.randomUUID();
                                await client.query('INSERT INTO workspaces (id, name, owner_id) VALUES ($1, $2, $3)', [workspaceId, `${user.name}'s workspace`, user.id]);
                                await client.query('INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, $3)', [workspaceId, user.id, "owner"]);
                                await client.query("COMMIT");
                            } catch (error) {
                                await client.query("ROLLBACK");
                                throw error;
                            } finally {
                                client.release();
                            }
                        } catch (error) {
                            await pool.query('DELETE FROM "user" WHERE id = $1', [user.id]);
                            throw error;
                        }
                    },
                },
            },
        },
    });
}

const app = new Hono<{ Bindings: Bindings }>();
app.get("/api/health", (c) => c.json({ ok: true }));
app.get("/api/config", (c) => c.json({ googleEnabled: googleEnabled(c.env) }));
app.on(["GET", "POST"], "/api/auth/*", async (c) => {
    const pool = new Pool({ connectionString: c.env.DATABASE_URL });
    try {
        return await createAuth(c.env, pool).handler(c.req.raw);
    } finally {
        c.executionCtx.waitUntil(pool.end());
    }
});
app.all("/api/*", (c) => c.json({ error: "Not found" }, 404));
export default app;

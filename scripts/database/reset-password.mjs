import { config } from "dotenv";

import argon2 from "argon2";
import pg from "pg";

config({ path: ".env.local", quiet: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const url = new URL(databaseUrl);
const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
const isLocalDatabase = localHosts.has(url.hostname);

if (!isLocalDatabase) {
  throw new Error("Refusing to reset passwords outside a local database.");
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  throw new Error("Usage: npm run db:reset-password -- <email> <new-password>");
}

if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
  throw new Error("Password must be at least 8 characters and contain letters and numbers.");
}

const passwordOptions = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  hashLength: 32,
};

const pool = new pg.Pool({ connectionString: databaseUrl });

try {
  const client = await pool.connect();

  try {
    const userResult = await client.query(
      `SELECT id FROM auth.users WHERE email = $1`,
      [email.toLowerCase()],
    );

    if (userResult.rowCount === 0) {
      throw new Error(`No user found with email "${email}".`);
    }

    const userId = userResult.rows[0].id;
    const passwordHash = await argon2.hash(password, passwordOptions);

    await client.query("BEGIN");
    await client.query(
      `INSERT INTO auth_private.password_credentials (user_id, password_hash, password_changed_at, must_change_password, created_at, updated_at)
       VALUES ($1, $2, now(), false, now(), now())
       ON CONFLICT (user_id) DO UPDATE
         SET password_hash = EXCLUDED.password_hash,
             password_changed_at = now(),
             must_change_password = false,
             updated_at = now()`,
      [userId, passwordHash],
    );
    await client.query(
      `INSERT INTO auth_private.security_events (user_id, event_type, metadata)
       VALUES ($1, 'password_reset_by_operator', $2::jsonb)`,
      [userId, JSON.stringify({ resetBy: "script" })],
    );
    await client.query("COMMIT");

    console.log(`Password reset for ${email}.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
} finally {
  await pool.end();
}

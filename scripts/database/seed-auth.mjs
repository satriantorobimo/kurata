import { randomBytes } from "node:crypto";

import argon2 from "argon2";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local", quiet: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed local development accounts.");
}

const url = new URL(databaseUrl);
const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
const isLocalDatabase = localHosts.has(url.hostname);
const isRemoteDemoSeed = !isLocalDatabase && process.env.ALLOW_REMOTE_DEMO_SEED === "true";

if ((process.env.NODE_ENV === "production" && !isRemoteDemoSeed) || (!isLocalDatabase && !isRemoteDemoSeed)) {
  throw new Error("Refusing to seed accounts outside a local database without ALLOW_REMOTE_DEMO_SEED=true.");
}

const passwordOptions = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  hashLength: 32,
};

const accounts = [
  { email: "demo.user@kurata.test", fullName: "Demo User", role: "user", passwordKey: "DEMO_USER_PASSWORD" },
  { email: "admin@kurata.test", fullName: "Kurata Admin", role: "admin", passwordKey: "DEMO_ADMIN_PASSWORD" },
  { email: "master.admin@kurata.test", fullName: "Kurata Master Admin", role: "super_admin", passwordKey: "DEMO_MASTER_ADMIN_PASSWORD" },
];

function createPassword() {
  return `${randomBytes(18).toString("base64url")}Aa1!`;
}

if (isRemoteDemoSeed) {
  for (const account of accounts) {
    const password = process.env[account.passwordKey];
    if (!password || password.length < 16) {
      throw new Error(`${account.passwordKey} must be set to a private password of at least 16 characters.`);
    }
  }
}

const pool = new pg.Pool({ connectionString: databaseUrl });

try {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const createdAccounts = [];

    for (const account of accounts) {
      const userResult = await client.query(
        `INSERT INTO auth.users (email, full_name, role, status, email_verified_at)
         VALUES ($1, $2, $3::auth.user_role, 'active', now())
         ON CONFLICT (email) DO UPDATE
           SET full_name = EXCLUDED.full_name,
               role = EXCLUDED.role,
               status = 'active',
               email_verified_at = COALESCE(auth.users.email_verified_at, now()),
               updated_at = now()
         RETURNING id`,
        [account.email, account.fullName, account.role],
      );
      const userId = userResult.rows[0].id;

      await client.query(
        `INSERT INTO core.user_profiles (user_id)
         VALUES ($1)
         ON CONFLICT (user_id) DO NOTHING`,
        [userId],
      );

      await client.query(
        `INSERT INTO core.user_verifications (user_id, status, submitted_at, reviewed_at)
         VALUES ($1, 'approved', now(), now())
         ON CONFLICT (user_id) DO UPDATE
           SET status = 'approved',
               submitted_at = COALESCE(core.user_verifications.submitted_at, now()),
               reviewed_at = now(),
               updated_at = now()`,
        [userId],
      );

      const credentialResult = await client.query(
        `SELECT 1 FROM auth_private.password_credentials WHERE user_id = $1`,
        [userId],
      );

      if (credentialResult.rowCount === 0) {
        const password = isRemoteDemoSeed ? process.env[account.passwordKey] : createPassword();
        const passwordHash = await argon2.hash(password, passwordOptions);

        await client.query(
          `INSERT INTO auth_private.password_credentials (user_id, password_hash)
           VALUES ($1, $2)`,
          [userId, passwordHash],
        );

        createdAccounts.push({ ...account, password });
      } else {
        createdAccounts.push({ ...account, password: "(existing password unchanged)" });
      }

      await client.query(
        `INSERT INTO auth_private.security_events (user_id, event_type, metadata)
         VALUES ($1, 'development_account_seeded', $2::jsonb)`,
        [userId, JSON.stringify({ role: account.role })],
      );
    }

    await client.query("COMMIT");

    console.log(isRemoteDemoSeed ? "Remote verified demo accounts:" : "Local verified dummy accounts:");
    for (const account of createdAccounts) {
      console.log(`${account.role}\t${account.email}\t${isRemoteDemoSeed ? "password configured privately" : account.password}`);
    }
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
} finally {
  await pool.end();
}

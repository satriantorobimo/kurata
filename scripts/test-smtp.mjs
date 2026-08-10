import { createTransport } from "nodemailer";

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!host || !port || !user || !pass) {
  console.error("Missing SMTP_* env vars. Usage:");
  console.error("  SMTP_HOST=mail.hostinger.com SMTP_PORT=587 SMTP_USER=noreply@mail.kurata.id SMTP_PASS='yourpass' node scripts/test-smtp.mjs");
  process.exit(1);
}

const transporter = createTransport({
  host,
  port: Number(port),
  secure: false,
  auth: { user, pass },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

try {
  console.log(`Connecting to ${host}:${port} as ${user}...`);
  await transporter.verify();
  console.log("✅ SMTP connection successful!");
} catch (err) {
  console.error("❌ SMTP connection failed:", err.message);
  process.exit(1);
}

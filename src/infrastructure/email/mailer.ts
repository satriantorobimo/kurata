import "server-only";

import { createTransport } from "nodemailer";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is required.`);
  return value;
}

function createMailTransport() {
  return createTransport({
    host: getEnv("SMTP_HOST"),
    port: Number(getEnv("SMTP_PORT")),
    secure: false,
    auth: {
      user: getEnv("SMTP_USER"),
      pass: getEnv("SMTP_PASS"),
    },
  });
}

const transporter = createMailTransport();

export function getTransporter() {
  return transporter;
}

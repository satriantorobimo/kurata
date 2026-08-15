import "server-only";

import { getTransporter } from "./mailer";

function siteUrl(): string {
  return process.env.SITE_URL ?? "https://kurata.id";
}

function senderEmail(): string {
  return process.env.SMTP_USER ?? "noreply@kurata.id";
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

export async function sendBrokerPasswordSetupEmail(to: string, token: string, userName: string): Promise<void> {
  const setupLink = `${siteUrl()}/set-password?token=${encodeURIComponent(token)}`;
  const safeName = escapeHtml(userName);
  const html = `<!DOCTYPE html><html lang="id"><body style="margin:0;padding:32px;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#4b5563;"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:auto;background:#fff;border-radius:12px;"><tr><td style="padding:40px;"><h1 style="margin:0 0 16px;color:#111827;font-size:22px;">Pendaftaran Mitra Kurata disetujui</h1><p>Halo ${safeName},</p><p>Pendaftaran Anda telah disetujui. Buat password untuk mengakses dashboard Mitra Kurata.</p><p style="margin:28px 0;text-align:center;"><a href="${setupLink}" style="display:inline-block;padding:12px 28px;background:#166534;color:#fff;font-weight:600;text-decoration:none;border-radius:8px;">Buat password</a></p><p style="font-size:13px;line-height:1.5;color:#6b7280;">Tautan ini berlaku selama 24 jam dan hanya dapat digunakan sekali. Jika tombol tidak berfungsi, salin tautan ini ke peramban Anda:<br /><a href="${setupLink}" style="word-break:break-all;color:#166534;">${setupLink}</a></p><p style="font-size:12px;color:#9ca3af;">Jika Anda tidak mengajukan pendaftaran Mitra Kurata, abaikan email ini.</p></td></tr></table></body></html>`;

  await getTransporter().sendMail({
    from: `"Kurata" <${senderEmail()}>`,
    to,
    subject: "Buat password akun Mitra Kurata Anda",
    html,
  });
}

import "server-only";

import { getTransporter } from "./mailer";

function siteUrl(): string {
  return process.env.SITE_URL ?? "https://kurata.id";
}

function senderEmail(): string {
  return process.env.SMTP_USER ?? "noreply@kurata.id";
}

function logoUrl(): string {
  return `${siteUrl()}/logo.png`;
}

function buildVerificationHtml(verifyLink: string, userName: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <tr><td style="padding:32px 40px 0;text-align:center;"><img src="${logoUrl()}" alt="Kurata" width="140" height="91" style="display:block;margin:0 auto;border:0;" /></td></tr>
    <tr><td style="padding:24px 40px 8px;"><h1 style="margin:0;font-size:22px;font-weight:700;color:#111827;">Verifikasi akun Kurata</h1></td></tr>
    <tr><td style="padding:8px 40px 8px;"><p style="margin:0;font-size:15px;line-height:1.6;color:#4b5563;">Halo ${escapeHtml(userName)},</p></td></tr>
    <tr><td style="padding:4px 40px 8px;"><p style="margin:0;font-size:15px;line-height:1.6;color:#4b5563;">Terima kasih telah mendaftar di Kurata. Klik tombol di bawah untuk mengonfirmasi alamat email Anda dan mengaktifkan akun.</p></td></tr>
    <tr><td style="padding:20px 40px 24px;text-align:center;">
      <a href="${verifyLink}" target="_blank" rel="noopener" style="display:inline-block;padding:12px 32px;background:#166534;color:#fff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">Verifikasi email saya</a>
    </td></tr>
    <tr><td style="padding:4px 40px 24px;"><p style="margin:0;font-size:13px;line-height:1.5;color:#9ca3af;">Tautan ini berlaku selama 24 jam. Jika tombol tidak berfungsi, salin dan tempel tautan berikut ke peramban Anda:</p><p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#6b7280;word-break:break-all;"><a href="${verifyLink}" target="_blank" rel="noopener" style="color:#166534;">${verifyLink}</a></p></td></tr>
    <tr><td style="padding:20px 40px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;"><p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;">Jika Anda tidak merasa mendaftar akun Kurata, abaikan email ini.</p></td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char] ?? char;
  });
}

export async function sendVerificationEmail(to: string, token: string, userName: string): Promise<void> {
  const verifyLink = `${siteUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  const html = buildVerificationHtml(verifyLink, userName);

  console.log(`[email] Sending verification to ${to} via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);

  const info = await getTransporter().sendMail({
    from: `"Kurata" <${senderEmail()}>`,
    to,
    subject: "Verifikasi akun Kurata Anda",
    html,
  });

  console.log(`[email] Verification sent to ${to}: ${info.messageId}`);
}

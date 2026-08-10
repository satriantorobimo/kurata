import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "uploads");
const PROPERTIES_DIR = join(UPLOAD_DIR, "properties");

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const EXT_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

export interface UploadOk {
  ok: true;
  url: string;
}

export interface UploadErr {
  ok: false;
  error: string;
}

export async function savePropertyImage(file: File): Promise<UploadOk | UploadErr> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: `Format tidak didukung. Gunakan JPG, PNG, WebP, atau AVIF.` };
  }

  if (file.size > MAX_SIZE) {
    return { ok: false, error: `Ukuran file terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal 5 MB.` };
  }

  if (file.size === 0) {
    return { ok: false, error: "File kosong." };
  }

  const ext = EXT_MAP[file.type] ?? ".jpg";
  const filename = `${randomUUID()}${ext}`;

  await mkdir(PROPERTIES_DIR, { recursive: true });

  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(join(PROPERTIES_DIR, filename), Buffer.from(bytes));

  return { ok: true, url: `/uploads/properties/${filename}` };
}

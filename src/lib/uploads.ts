import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? join(/*turbopackIgnore: true*/ process.cwd(), "public", "uploads");
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

function detectMimeType(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47
  ) {
    return "image/png";
  }

  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  if (
    buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70 &&
    ((buffer[8] === 0x61 && buffer[9] === 0x76 && buffer[10] === 0x69 && buffer[11] === 0x66) ||
     (buffer[8] === 0x61 && buffer[9] === 0x76 && buffer[10] === 0x69 && buffer[11] === 0x73))
  ) {
    return "image/avif";
  }

  return null;
}

export async function savePropertyImage(file: File): Promise<UploadOk | UploadErr> {
  if (file.size > MAX_SIZE) {
    return { ok: false, error: `Ukuran file terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal 5 MB.` };
  }

  if (file.size === 0) {
    return { ok: false, error: "File kosong." };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const buffer = Buffer.from(bytes);
  const detectedType = detectMimeType(buffer);

  if (!detectedType || !ALLOWED_TYPES.includes(detectedType)) {
    return { ok: false, error: `Format tidak didukung. Gunakan JPG, PNG, WebP, atau AVIF.` };
  }

  const ext = EXT_MAP[detectedType] ?? ".jpg";
  const filename = `${randomUUID()}${ext}`;

  await mkdir(PROPERTIES_DIR, { recursive: true });
  await writeFile(join(PROPERTIES_DIR, filename), buffer);

  return { ok: true, url: `/uploads/properties/${filename}` };
}

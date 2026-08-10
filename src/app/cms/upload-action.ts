"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/infrastructure/security/authorization-dal";
import { savePropertyImage } from "@/lib/uploads";

export async function uploadPropertyImageAction(formData: FormData) {
  try {
    await requireRole("super_admin");

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Pilih file gambar terlebih dahulu." };
    }

    const result = await savePropertyImage(file);
    if (!result.ok) return { ok: false, error: result.error };

    revalidatePath("/cms/properties/[id]", "page");

    return { ok: true, url: result.url };
  } catch {
    return { ok: false, error: "Gagal mengunggah gambar. Coba lagi." };
  }
}

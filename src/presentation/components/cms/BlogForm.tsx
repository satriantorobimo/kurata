"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";

import { createBlogAction, updateBlogAction, type CmsActionResult } from "@/app/cms/actions";
import type { CmsBlogDetail } from "@/infrastructure/repositories/PostgresCmsRepository";
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS } from "@/domain/entities/BlogArticle";
import { Card } from "@/presentation/components/cms/Card";
import { Checkbox, SelectInput, TextArea, TextInput } from "@/presentation/components/cms/Field";
import { Notice } from "@/presentation/components/cms/Notice";
import { slugify } from "@/presentation/components/cms/format";

interface SectionDraft {
  heading: string;
  paragraphs: string;
  points: string;
  callout: string;
}

interface BlogFormProps {
  mode: "create" | "edit";
  slug?: string;
  initial?: CmsBlogDetail;
}

const inputClasses =
  "mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20";

function toDraft(initial?: CmsBlogDetail): SectionDraft[] {
  return (
    initial?.sections.map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs.join("\n"),
      points: section.points?.join(", ") ?? "",
      callout: section.callout ?? "",
    })) ?? []
  );
}

function splitLines(value: string): string[] {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function splitFields(value: string): string[] {
  if (!value.trim()) return [];
  return value.split(",").map((item) => item.trim().replace(/^\/+|\/+$/g, "")).filter(Boolean);
}

function toDate(value: string): Date {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function BlogForm({ mode, slug, initial }: BlogFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slugValue, setSlugValue] = useState(initial?.slug ?? slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [sections, setSections] = useState<SectionDraft[]>(toDraft(initial));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");

  const updateSection = (index: number, patch: Partial<SectionDraft>) => {
    setSections((current) => current.map((section, i) => (i === index ? { ...section, ...patch } : section)));
  };

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlugValue(slugify(value));
  };

  const submit = (formData: FormData) => {
    const input = {
      slug: slugValue.trim(),
      title: title.trim(),
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      category: String(formData.get("category") ?? BLOG_CATEGORIES[0]),
      author: String(formData.get("author") ?? "").trim(),
      readingMinutes: Number(formData.get("readingMinutes") ?? 1),
      coverImageUrl: String(formData.get("coverImageUrl") ?? "").trim(),
      coverImageAlt: String(formData.get("coverImageAlt") ?? "").trim(),
      isPublished: formData.get("isPublished") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      publishedAt: toDate(String(formData.get("publishedAt") ?? "")),
      sections: sections.map((section) => ({
        heading: section.heading.trim(),
        paragraphs: splitLines(section.paragraphs),
        points: splitFields(section.points),
        callout: section.callout.trim() || null,
      })),
      relatedSlugs: splitFields(String(formData.get("relatedSlugs") ?? "")),
    };

    startTransition(async () => {
      const result: CmsActionResult = mode === "create" ? await createBlogAction(input) : await updateBlogAction(slug!, input);
      if (result.ok) {
        setFieldErrors({});
        setNotice(result.message ?? "Artikel disimpan.");
        router.refresh();
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setNotice(result.message ?? "Tidak dapat menyimpan artikel.");
      }
    });
  };

  const error = (name: string) => fieldErrors[name];

  return (
    <form action={submit} className="space-y-6">
      {notice ? <Notice tone={notice.includes("berhas") ? "success" : "error"} message={notice} onDismiss={() => setNotice("")} /> : null}

      <Card>
        <div className="text-headline-sm font-headline-sm text-on-surface">Artikel</div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextInput id="title" name="title" label="Judul artikel" required value={title} onChange={(event) => onTitleChange(event.target.value)} error={error("title")} />
          </div>
          <div className="sm:col-span-2">
            <TextInput id="slug" name="slug" label="Slug (URL)" required value={slugValue} onChange={(event) => { setSlugValue(event.target.value); setSlugTouched(true); }} disabled={mode === "edit"} hint={mode === "edit" ? "Slug tidak dapat diubah." : "Diisi otomatis dari judul."} error={error("slug")} />
          </div>
          <SelectInput id="category" name="category" label="Kategori" options={BLOG_CATEGORIES.map((value) => ({ value, label: BLOG_CATEGORY_LABELS[value] }))} defaultValue={initial?.category ?? BLOG_CATEGORIES[0]} error={error("category")} />
          <TextInput id="author" name="author" label="Penulis" required defaultValue={initial?.author} error={error("author")} />
          <div className="sm:col-span-2">
            <TextArea id="excerpt" name="excerpt" label="Ringkasan / intro" required rows={3} defaultValue={initial?.excerpt} error={error("excerpt")} />
          </div>
          <div className="sm:col-span-2">
            <TextInput id="coverImageUrl" name="coverImageUrl" label="URL gambar sampul" required type="url" defaultValue={initial?.coverImageUrl} error={error("coverImageUrl")} />
          </div>
          <TextInput id="coverImageAlt" name="coverImageAlt" label="Teks alternatif gambar" defaultValue={initial?.coverImageAlt} />
          <TextInput id="readingMinutes" name="readingMinutes" label="Durasi baca (menit)" type="number" defaultValue={String(initial?.readingMinutes ?? 4)} />
          <TextInput id="publishedAt" name="publishedAt" label="Tanggal terbit" type="date" defaultValue={initial?.publishedAt ?? todayIso()} />
        </div>
        <div className="mt-5 flex flex-wrap gap-6">
          <Checkbox id="isPublished" name="isPublished" label="Tayangkan artikel" defaultValue={initial?.isPublished ?? false} />
          <Checkbox id="isFeatured" name="isFeatured" label="Tandai sebagai unggulan" defaultValue={initial?.isFeatured ?? false} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="text-headline-sm font-headline-sm text-on-surface">Isi artikel</div>
            <p className="mt-1 text-body-md text-on-surface-variant">Satu paragraf per baris; poin dipisahkan dengan koma.</p>
          </div>
          <button type="button" onClick={() => setSections([...sections, { heading: "", paragraphs: "", points: "", callout: "" }])} className="inline-flex w-fit items-center gap-2 rounded-lg border border-primary px-3 py-2 text-label-md font-medium text-primary transition-colors hover:bg-primary/5">
            <Plus className="h-4 w-4" />
            Tambah bagian
          </button>
        </div>
        <div className="mt-5 space-y-5">
          {sections.length === 0 ? <p className="rounded-xl bg-surface-container-low px-4 py-6 text-center text-body-md text-on-surface-variant">Belum ada bagian. Tambahkan bagian untuk isi artikel.</p> : null}
          {sections.map((section, index) => (
            <div key={index} className="rounded-xl border border-border-subtle p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-label-sm font-medium text-on-surface-variant">Bagian {index + 1}</span>
                <button type="button" onClick={() => setSections(sections.filter((_, i) => i !== index))} aria-label="Hapus bagian" className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 space-y-4">
                <TextInput id={`section-heading-${index}`} name={`section-heading-${index}`} label="Judul bagian" value={section.heading} onChange={(event) => updateSection(index, { heading: event.target.value })} />
                <TextArea id={`section-paragraphs-${index}`} label="Paragraf" rows={3} value={section.paragraphs} onChange={(event) => updateSection(index, { paragraphs: event.target.value })} hint="Satu paragraf per baris." />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput id={`section-points-${index}`} name={`section-points-${index}`} label="Poin (ceri)" value={section.points} onChange={(event) => updateSection(index, { points: event.target.value })} hint="Pisahkan dengan koma." />
                  <div>
                    <label htmlFor={`section-callout-${index}`} className="text-label-md font-label-md text-on-surface">
                      Callout
                    </label>
                    <input id={`section-callout-${index}`} className={inputClasses} value={section.callout} onChange={(event) => updateSection(index, { callout: event.target.value })} placeholder="Kutipan penekanan (opsional)" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <TextInput id="relatedSlugs" name="relatedSlugs" label="Artikel terkait (slug)" hint="Pisahkan dengan koma. Contoh: panduan-sertifikat, cara-jual-tanah" defaultValue={initial?.relatedSlugs.join(", ")} />
      </Card>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-border-subtle px-5 py-3 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-low">
          Batal
        </button>
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
          {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {pending ? "Menyimpan..." : mode === "create" ? "Terbitkan artikel" : "Simpan perubahan"}
        </button>
      </div>
    </form>
  );
}
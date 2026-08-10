"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";

import { updateContentSectionAction, type CmsActionResult } from "@/app/cms/actions";
import type { CmsContentSection } from "@/infrastructure/repositories/PostgresCmsRepository";
import { Card } from "@/presentation/components/cms/Card";
import { Checkbox, TextInput } from "@/presentation/components/cms/Field";
import { ImageUpload } from "@/presentation/components/cms/ImageUpload";
import { Notice } from "@/presentation/components/cms/Notice";

const ICON_OPTIONS = [
  "ArrowLeftRight", "Building", "Building2", "Car", "CheckCircle2", "CircleDollarSign",
  "Factory", "Fuel", "Home", "Landmark", "LocateFixed", "MapPin", "MessageCircle",
  "MoveHorizontal", "Navigation", "Ruler", "Search", "Sprout", "Star", "Store",
  "TreePalm", "TrendingUp", "Truck", "UtensilsCrossed", "Warehouse",
];

const RATING_OPTIONS = [
  { value: "1", label: "1" }, { value: "2", label: "2" },
  { value: "3", label: "3" }, { value: "4", label: "4" }, { value: "5", label: "5" },
];

const SCORE_OPTIONS = [
  { value: "1.0", label: "1.0" }, { value: "2.0", label: "2.0" }, { value: "3.0", label: "3.0" },
  { value: "4.0", label: "4.0" }, { value: "5.0", label: "5.0" },
];

interface BrokerItem { name: string; location: string; rating: number; reviewCount: number; imagePath: string }

interface Props { section: CmsContentSection; canWrite: boolean }

const inputClasses = "w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function InvestasiSectionEditor({ section, canWrite }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [notice, setNotice] = useState("");
  const [isPublished, setIsPublished] = useState(section.isPublished);

  const save = (content: unknown) => {
    if (!canWrite) return;
    startTransition(async () => {
      const result: CmsActionResult = await updateContentSectionAction(section.id, {
        section: section.section,
        content,
        position: section.position,
        isPublished,
      });
      setNotice(result.message ?? "Selesai.");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {notice ? <Notice tone={notice.includes("berhas") ? "success" : "error"} message={notice} onDismiss={() => setNotice("")} /> : null}

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-label-sm text-on-surface-variant">ID: {section.id}</span>
          </div>
          {canWrite ? <Checkbox id="isPublished" name="isPublished" label="Tayang di situs" checked={isPublished} onChange={() => setIsPublished(!isPublished)} /> : null}
        </div>
      </Card>

      {section.id === "investasi-categories" ? <CategoriesEditor data={asArray(section.content)} onSave={(d) => save(d)} canWrite={canWrite} /> : null}
      {section.id === "investasi-listings" ? <ListingCardsEditor data={asArray(section.content)} onSave={(d) => save(d)} canWrite={canWrite} withArea /> : null}
      {section.id === "investasi-similar" ? <ListingCardsEditor data={asArray(section.content)} onSave={(d) => save(d)} canWrite={canWrite} withArea={false} /> : null}
      {section.id === "investasi-features" ? <CategoriesEditor data={asArray(section.content)} onSave={(d) => save(d)} canWrite={canWrite} /> : null}
      {section.id === "investasi-opportunities" ? <TextListEditor data={asArray<string>(section.content)} onSave={(d) => save(d)} canWrite={canWrite} /> : null}
      {section.id === "investasi-area-analysis" ? <RatingEditor data={asArray(section.content)} onSave={(d) => save(d)} canWrite={canWrite} /> : null}
      {section.id === "investasi-infrastructure" ? <InfrastructureEditor data={asArray(section.content)} onSave={(d) => save(d)} canWrite={canWrite} /> : null}
      {section.id === "investasi-score-metrics" ? <ScoreEditor data={asArray(section.content)} onSave={(d) => save(d)} canWrite={canWrite} /> : null}
      {section.id === "investasi-broker" ? (
    <BrokerEditor
      data={asBroker(section.content)}
      onSave={(d) => save(d)}
      canWrite={canWrite}
    />
  ) : null}
    </div>
  );
}

// --------------------------------------------------------------- Helpers
function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// -------------------------------------------------- Categories / Features
interface CategoryItem { icon: string; label: string }

function CategoriesEditor({ data, onSave, canWrite }: { data: CategoryItem[]; onSave(data: CategoryItem[]): void; canWrite: boolean }) {
  const [items, setItems] = useState<CategoryItem[]>(data);

  const setItem = (index: number, patch: Partial<CategoryItem>) => {
    setItems(items.map((item, i) => i === index ? { ...item, ...patch } : item));
  };

  const add = () => setItems([...items, { icon: "Home", label: "" }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-headline-sm font-headline-sm text-on-surface">Daftar item</div>
        {canWrite ? <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-label-sm font-medium text-on-primary hover:bg-primary/90"><Plus className="h-4 w-4" />Tambah</button> : null}
      </div>
      <div className="mt-5 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <select value={item.icon} onChange={(e) => setItem(i, { icon: e.target.value })} disabled={!canWrite} aria-label={`Ikon ${i + 1}`} className={`${inputClasses} w-44 shrink-0`}>
              {ICON_OPTIONS.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
            <input type="text" value={item.label} onChange={(e) => setItem(i, { label: e.target.value })} disabled={!canWrite} aria-label={`Label ${i + 1}`} className={`${inputClasses} flex-1`} placeholder="Label" />
            {canWrite ? <button type="button" onClick={() => remove(i)} aria-label={`Hapus ${i + 1}`} className="mt-1 shrink-0 rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"><Trash2 className="h-4 w-4" /></button> : null}
          </div>
        ))}
      </div>
      {canWrite ? <div className="mt-6 flex justify-end"><SaveButton pending={false} onClick={() => onSave(items)} /></div> : null}
    </Card>
  );
}

// --------------------------------------------------------------- Listings
interface ListingItem { title: string; location: string; area?: string; price: string; imageUrl: string }

function ListingCardsEditor({ data, onSave, canWrite, withArea }: { data: ListingItem[]; onSave(data: ListingItem[]): void; canWrite: boolean; withArea: boolean }) {
  const [items, setItems] = useState<ListingItem[]>(data);
  const [pending, startTransition] = useTransition();

  const setItem = (index: number, patch: Partial<ListingItem>) => {
    setItems(items.map((item, i) => i === index ? { ...item, ...patch } : item));
  };

  const add = () => setItems([...items, { title: "", location: "", area: withArea ? "" : undefined, price: "", imageUrl: "" }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const doSave = () => startTransition(() => onSave(items));

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-headline-sm font-headline-sm text-on-surface">{withArea ? "Listing rekomendasi" : "Listing serupa"}</div>
        {canWrite ? <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-label-sm font-medium text-on-primary hover:bg-primary/90"><Plus className="h-4 w-4" />Tambah listing</button> : null}
      </div>
      <div className="mt-5 space-y-6">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border-subtle p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-label-sm font-medium text-on-surface-variant">Listing {i + 1}</span>
              {canWrite ? <button type="button" onClick={() => remove(i)} aria-label={`Hapus listing ${i + 1}`} className="rounded-lg p-1 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"><Trash2 className="h-4 w-4" /></button> : null}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><TextInput id={`title-${i}`} name={`title-${i}`} label="Judul" value={item.title} onChange={(e) => setItem(i, { title: e.target.value })} disabled={!canWrite} /></div>
              <TextInput id={`loc-${i}`} name={`loc-${i}`} label="Lokasi" value={item.location} onChange={(e) => setItem(i, { location: e.target.value })} disabled={!canWrite} />
              {withArea ? <TextInput id={`area-${i}`} name={`area-${i}`} label="Luas" value={item.area ?? ""} onChange={(e) => setItem(i, { area: e.target.value })} disabled={!canWrite} /> : null}
              <TextInput id={`price-${i}`} name={`price-${i}`} label="Harga" value={item.price} onChange={(e) => setItem(i, { price: e.target.value })} disabled={!canWrite} />
              <div className="sm:col-span-2">
                <ImageUpload name={`img-${i}`} label="Gambar" currentUrl={item.imageUrl} disabled={!canWrite} onUrlChange={(url) => setItem(i, { imageUrl: url })} hint={canWrite ? "Pilih & unggah gambar baru" : undefined} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {canWrite ? <div className="mt-6 flex justify-end"><SaveButton pending={pending} onClick={doSave} /></div> : null}
    </Card>
  );
}

// -------------------------------------------- Text list (opportunities)
function TextListEditor({ data, onSave, canWrite }: { data: string[]; onSave(data: string[]): void; canWrite: boolean }) {
  const [items, setItems] = useState<string[]>(data);

  const setItem = (i: number, value: string) => setItems(items.map((item, idx) => idx === i ? value : item));
  const add = () => setItems([...items, ""]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-headline-sm font-headline-sm text-on-surface">Peluang bisnis</div>
        {canWrite ? <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-label-sm font-medium text-on-primary hover:bg-primary/90"><Plus className="h-4 w-4" />Tambah poin</button> : null}
      </div>
      <div className="mt-5 space-y-2">
        {items.map((text, i) => (
          <div key={i} className="flex items-start gap-2">
            <input type="text" value={text} onChange={(e) => setItem(i, e.target.value)} disabled={!canWrite} aria-label={`Poin ${i + 1}`} className={inputClasses} placeholder="Tulis peluang bisnis..." />
            {canWrite ? <button type="button" onClick={() => remove(i)} aria-label={`Hapus poin ${i + 1}`} className="mt-1 shrink-0 rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"><Trash2 className="h-4 w-4" /></button> : null}
          </div>
        ))}
      </div>
      {canWrite ? <div className="mt-6 flex justify-end"><SaveButton pending={false} onClick={() => onSave(items.filter(Boolean))} /></div> : null}
    </Card>
  );
}

// -------------------------------------------------------- Area analysis
interface RatingItem { label: string; rating: number }

function RatingEditor({ data, onSave, canWrite }: { data: RatingItem[]; onSave(data: RatingItem[]): void; canWrite: boolean }) {
  const [items, setItems] = useState<RatingItem[]>(data);

  const setItem = (i: number, patch: Partial<RatingItem>) => setItems(items.map((item, idx) => idx === i ? { ...item, ...patch } : item));
  const add = () => setItems([...items, { label: "", rating: 3 }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-headline-sm font-headline-sm text-on-surface">Analisis area</div>
        {canWrite ? <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-label-sm font-medium text-on-primary hover:bg-primary/90"><Plus className="h-4 w-4" />Tambah metrik</button> : null}
      </div>
      <div className="mt-5 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <input type="text" value={item.label} onChange={(e) => setItem(i, { label: e.target.value })} disabled={!canWrite} aria-label={`Label ${i + 1}`} className={`${inputClasses} flex-1`} placeholder="Label" />
            <select value={item.rating} onChange={(e) => setItem(i, { rating: Number(e.target.value) })} disabled={!canWrite} aria-label={`Rating ${i + 1}`} className={`${inputClasses} w-24`}>
              {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {canWrite ? <button type="button" onClick={() => remove(i)} aria-label={`Hapus ${i + 1}`} className="mt-1 shrink-0 rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"><Trash2 className="h-4 w-4" /></button> : null}
          </div>
        ))}
      </div>
      {canWrite ? <div className="mt-6 flex justify-end"><SaveButton pending={false} onClick={() => onSave(items)} /></div> : null}
    </Card>
  );
}

// ------------------------------------------------------- Infrastructure
interface InfraItem { label: string; distance: string }

function InfrastructureEditor({ data, onSave, canWrite }: { data: InfraItem[]; onSave(data: InfraItem[]): void; canWrite: boolean }) {
  const [items, setItems] = useState<InfraItem[]>(data);

  const setItem = (i: number, patch: Partial<InfraItem>) => setItems(items.map((item, idx) => idx === i ? { ...item, ...patch } : item));
  const add = () => setItems([...items, { label: "", distance: "" }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-headline-sm font-headline-sm text-on-surface">Infrastruktur sekitar</div>
        {canWrite ? <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-label-sm font-medium text-on-primary hover:bg-primary/90"><Plus className="h-4 w-4" />Tambah item</button> : null}
      </div>
      <div className="mt-5 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <input type="text" value={item.label} onChange={(e) => setItem(i, { label: e.target.value })} disabled={!canWrite} aria-label={`Label ${i + 1}`} className={`${inputClasses} flex-1`} placeholder="Nama tempat / lokasi" />
            <input type="text" value={item.distance} onChange={(e) => setItem(i, { distance: e.target.value })} disabled={!canWrite} aria-label={`Jarak ${i + 1}`} className={`${inputClasses} w-32`} placeholder="Jarak" />
            {canWrite ? <button type="button" onClick={() => remove(i)} aria-label={`Hapus ${i + 1}`} className="mt-1 shrink-0 rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"><Trash2 className="h-4 w-4" /></button> : null}
          </div>
        ))}
      </div>
      {canWrite ? <div className="mt-6 flex justify-end"><SaveButton pending={false} onClick={() => onSave(items)} /></div> : null}
    </Card>
  );
}

// ---------------------------------------------------------- Score metrics
interface ScoreItem { label: string; score: number }

function ScoreEditor({ data, onSave, canWrite }: { data: ScoreItem[]; onSave(data: ScoreItem[]): void; canWrite: boolean }) {
  const [items, setItems] = useState<ScoreItem[]>(data);

  const setItem = (i: number, patch: Partial<ScoreItem>) => setItems(items.map((item, idx) => idx === i ? { ...item, ...patch } : item));
  const add = () => setItems([...items, { label: "", score: 5.0 }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-headline-sm font-headline-sm text-on-surface">Skor metrik</div>
        {canWrite ? <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-label-sm font-medium text-on-primary hover:bg-primary/90"><Plus className="h-4 w-4" />Tambah metrik</button> : null}
      </div>
      <div className="mt-5 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <input type="text" value={item.label} onChange={(e) => setItem(i, { label: e.target.value })} disabled={!canWrite} aria-label={`Label ${i + 1}`} className={`${inputClasses} flex-1`} placeholder="Label" />
            <select value={item.score} onChange={(e) => setItem(i, { score: Number(e.target.value) })} disabled={!canWrite} aria-label={`Skor ${i + 1}`} className={`${inputClasses} w-24`}>
              {SCORE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {canWrite ? <button type="button" onClick={() => remove(i)} aria-label={`Hapus ${i + 1}`} className="mt-1 shrink-0 rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"><Trash2 className="h-4 w-4" /></button> : null}
          </div>
        ))}
      </div>
      {canWrite ? <div className="mt-6 flex justify-end"><SaveButton pending={false} onClick={() => onSave(items)} /></div> : null}
    </Card>
  );
}

// --------------------------------------------------------------- Broker

function asBroker(value: unknown): BrokerItem {
  if (isObject(value)) {
    return {
      name: String(value.name ?? ""),
      location: String(value.location ?? ""),
      rating: Number(value.rating ?? 5),
      reviewCount: Number(value.reviewCount ?? 0),
      imagePath: String(value.imagePath ?? ""),
    };
  }
  return { name: "", location: "", rating: 5, reviewCount: 0, imagePath: "" };
}

function BrokerEditor({ data, onSave, canWrite }: { data: BrokerItem; onSave(data: BrokerItem): void; canWrite: boolean }) {
  const [item, setItem] = useState<BrokerItem>(data);

  const patch = (p: Partial<BrokerItem>) => setItem({ ...item, ...p });

  return (
    <Card>
      <div className="text-headline-sm font-headline-sm text-on-surface">Detail broker / mitra</div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <TextInput id="broker-name" name="broker-name" label="Nama" value={item.name} onChange={(e) => patch({ name: e.target.value })} disabled={!canWrite} />
        <TextInput id="broker-loc" name="broker-loc" label="Lokasi" value={item.location} onChange={(e) => patch({ location: e.target.value })} disabled={!canWrite} />
        <TextInput id="broker-rating" name="broker-rating" label="Rating (0-5)" type="number" value={String(item.rating)} onChange={(e) => patch({ rating: Number(e.target.value) })} disabled={!canWrite} />
        <TextInput id="broker-reviews" name="broker-reviews" label="Jumlah ulasan" type="number" value={String(item.reviewCount)} onChange={(e) => patch({ reviewCount: Number(e.target.value) })} disabled={!canWrite} />
        <div className="sm:col-span-2">
          <ImageUpload name="broker-img" label="Foto broker" currentUrl={item.imagePath} disabled={!canWrite} onUrlChange={(url) => patch({ imagePath: url })} hint={canWrite ? "Pilih & unggah foto baru" : undefined} />
        </div>
      </div>
      {canWrite ? <div className="mt-6 flex justify-end"><SaveButton pending={false} onClick={() => onSave(item)} /></div> : null}
    </Card>
  );
}

// ------------------------------------------------------------- SaveButton
function SaveButton({ pending, onClick }: { pending: boolean; onClick: () => void }) {
  return (
    <button type="button" disabled={pending} onClick={onClick} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {pending ? "Menyimpan..." : "Simpan perubahan"}
    </button>
  );
}
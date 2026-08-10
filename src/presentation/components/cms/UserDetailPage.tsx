"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { deleteUserAction, updateUserAction, updateUserVerificationAction } from "@/app/cms/actions";
import type { CmsUserDetail, VerificationStatus } from "@/infrastructure/repositories/PostgresCmsRepository";
import { Card, CardHeader } from "@/presentation/components/cms/Card";
import { SelectInput, TextInput } from "@/presentation/components/cms/Field";
import { Notice } from "@/presentation/components/cms/Notice";
import { StatusBadge } from "@/presentation/components/cms/StatusBadge";
import { ConfirmDialog } from "@/presentation/components/cms/ConfirmDialog";

const ROLE_OPTIONS = [
  { value: "user", label: "Pengguna" },
  { value: "broker", label: "Mitra Kurata" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Master Admin" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Aktif" },
  { value: "suspended", label: "Ditangguhkan" },
  { value: "archived", label: "Diarsipkan" },
];

const VERIFICATION_OPTIONS = [
  { value: "not_started", label: "Belum dimulai" },
  { value: "submitted", label: "Diajukan" },
  { value: "under_review", label: "Ditinjau" },
  { value: "approved", label: "Disetujui" },
  { value: "changes_requested", label: "Perlu perbaikan" },
  { value: "rejected", label: "Ditolak" },
];

export function UserDetailPage({ user, canWrite }: { user: CmsUserDetail; canWrite: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateAccount = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateUserAction(user.id, {
        fullName: String(formData.get("fullName") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim() || null,
        role: String(formData.get("role") ?? "user") as "user" | "broker" | "admin" | "super_admin",
        status: String(formData.get("status") ?? "active") as "active" | "suspended" | "archived",
      });
      if (result.ok) {
        setNotice(result.message ?? "Akun diperbarui.");
        setFieldErrors({});
        router.refresh();
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setNotice(result.message ?? "Tidak dapat memperbarui akun.");
      }
    });
  };

  const updateVerification = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateUserVerificationAction(user.id, {
        status: String(formData.get("verificationStatus") ?? "not_started") as VerificationStatus,
        notes: null,
      });
      setNotice(result.message ?? "Verifikasi diperbarui.");
      router.refresh();
    });
  };

  const confirmDelete = () => {
    startTransition(async () => {
      const result = await deleteUserAction(user.id);
      setDeleteOpen(false);
      setNotice(result.message ?? "Akun dihapus.");
      if (result.ok) {
        router.push("/cms/users");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      {notice ? <Notice tone={notice.includes("berhas") || notice.includes("diperbarui") ? "success" : "error"} message={notice} onDismiss={() => setNotice("")} /> : null}

      <Card>
        <CardHeader
          title="Akun"
          description="Data profil dan status keanggotaan."
          action={
            <div className="flex items-center gap-2">
              <StatusBadge value={user.role} />
              <StatusBadge value={user.status} />
            </div>
          }
        />
        <form action={updateAccount}>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput id="fullName" name="fullName" label="Nama lengkap" required disabled={!canWrite} defaultValue={user.fullName} error={fieldErrors.fullName} />
            <TextInput id="email" name="email" label="Email" disabled defaultValue={user.email} hint="Email tidak dapat diubah." />
            <TextInput id="phone" name="phone" label="Telepon" disabled={!canWrite} defaultValue={user.phone ?? ""} />
            <SelectInput id="role" name="role" label="Peran" required disabled={!canWrite} defaultValue={user.role} options={ROLE_OPTIONS} error={fieldErrors.role} />
            <SelectInput id="status" name="status" label="Status akun" required disabled={!canWrite} defaultValue={user.status} options={STATUS_OPTIONS} error={fieldErrors.status} />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-label-sm text-on-surface-variant">
              Terdaftar {user.createdAt} {user.lastSignedInAt ? `· masuk terakhir ${user.lastSignedInAt}` : ""}
            </p>
            <div className="flex gap-3">
              {canWrite ? (
                <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
                  {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  Simpan akun
                </button>
              ) : null}
            </div>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader title="Verifikasi identitas" description="Status verifikasi dokumen Mitra Kurata." action={user.verificationStatus ? <StatusBadge value={user.verificationStatus} /> : undefined} />
        {user.verificationStatus ? (
          <form action={updateVerification}>
            <SelectInput id="verificationStatus" name="verificationStatus" label="Status verifikasi" required disabled={!canWrite} defaultValue={user.verificationStatus} options={VERIFICATION_OPTIONS} />
            {canWrite ? (
              <div className="mt-5 flex justify-end">
                <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
                  {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  Simpan verifikasi
                </button>
              </div>
            ) : null}
          </form>
        ) : (
          <p className="text-body-md text-on-surface-variant">Verifikasi belum diajukan oleh pengguna ini.</p>
        )}
      </Card>

      <Card>
        <CardHeader title="Informasi tambahan" />
        <dl className="grid gap-4 text-body-md sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3">
            <dt className="text-on-surface-variant">Kota</dt>
            <dd className="font-medium text-on-surface">{user.city ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3">
            <dt className="text-on-surface-variant">Jumlah aset</dt>
            <dd className="font-medium text-on-surface">{user.propertyCount}</dd>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3">
            <dt className="text-on-surface-variant">Persetujuan pemasaran</dt>
            <dd className="font-medium text-on-surface">{user.marketingConsent ? "Ya" : "Tidak"}</dd>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3">
            <dt className="text-on-surface-variant">Email terverifikasi</dt>
            <dd className="font-medium text-on-surface">{user.emailVerifiedAt ? `Ya (${user.emailVerifiedAt})` : "Belum"}</dd>
          </div>
        </dl>
      </Card>

      {canWrite && user.role !== "super_admin" ? (
        <div className="flex justify-end">
          <button type="button" onClick={() => setDeleteOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-error/30 px-4 py-2.5 text-label-md font-label-md text-error transition-colors hover:bg-error-container">
            <Trash2 className="h-4 w-4" />
            Hapus akun
          </button>
        </div>
      ) : null}

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus akun?"
        description={`Seluruh data ${user.fullName} (${user.email}) akan dihapus permanen.`}
        confirmLabel="Hapus"
        danger
        onConfirm={confirmDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
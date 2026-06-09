"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  analyzeSpecSchema,
  type AnalyzeSpecFormData,
} from "../schemas/analyze-spec.schema";

interface UploadFormProps {
  onSubmit: (data: AnalyzeSpecFormData) => void;
}

export function UploadForm({ onSubmit }: UploadFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<AnalyzeSpecFormData>({
    resolver: zodResolver(analyzeSpecSchema),
    mode: "onChange",
  });

  const specFile = watch("specFile");
  const profileFile = watch("profileFile");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="akk-card p-6 transition-shadow hover:shadow-[var(--shadow-brand-md)]">
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
            1
          </span>
          Cahier des charges (.docx / .pdf)
        </label>
        <input
          type="file"
          accept=".docx,.pdf"
          {...register("specFile")}
          className="block w-full text-sm text-muted file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-medium"
        />
        {specFile?.[0] && (
          <p className="mt-2 text-sm text-muted">
            Sélectionné : <span className="font-medium text-ink">{specFile[0].name}</span>
          </p>
        )}
        {errors.specFile && (
          <p className="mt-1 text-sm text-error">{errors.specFile.message}</p>
        )}
      </div>

      <div className="akk-card p-6 transition-shadow hover:shadow-[var(--shadow-brand-md)]">
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
            2
          </span>
          Profil candidat (.json)
        </label>
        <input
          type="file"
          accept=".json"
          {...register("profileFile")}
          className="block w-full text-sm text-muted file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-medium"
        />
        {profileFile?.[0] && (
          <p className="mt-2 text-sm text-muted">
            Sélectionné : <span className="font-medium text-ink">{profileFile[0].name}</span>
          </p>
        )}
        {errors.profileFile && (
          <p className="mt-1 text-sm text-error">
            {errors.profileFile.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white shadow-[var(--shadow-brand-md)] transition-all hover:bg-brand-medium disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        Analyser le document
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, FormProvider } from "react-hook-form";
import { UploadForm } from "./components/UploadForm";
import { PtfForm } from "./components/PtfForm";
import { SectionNav } from "./components/SectionNav";
import { ptfFormSchema, type PtfFormData } from "./schemas/ptf-form.schema";
import type { AnalyzeSpecFormData } from "./schemas/analyze-spec.schema";

function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <Image
            src="/akkodis-logo.png"
            alt="Akkodis"
            width={132}
            height={32}
            priority
            className="h-7 w-auto"
          />
          <span className="hidden h-6 w-px bg-line sm:block" />
          <span className="hidden text-sm font-medium text-muted sm:block">
            Générateur de proposition
          </span>
        </div>
        <span className="rounded-full bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
          EOD
        </span>
      </div>
    </header>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const ptfForm = useForm<PtfFormData>({
    defaultValues: ptfFormSchema.parse({}),
  });

  const handleUpload = async (data: AnalyzeSpecFormData) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("specFile", data.specFile[0]);
    formData.append("profileFile", data.profileFile[0]);

    const res = await fetch("/api/analyze-spec", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();

    if (json.structured) {
      const { specifications, profiles } = json.structured as {
        specifications: Record<string, unknown>;
        profiles: Record<string, unknown>;
      };
      ptfForm.reset({
        ...ptfFormSchema.parse({}),
        ...specifications,
        ...profiles,
      });
    }

    setLoading(false);
    setAnalyzed(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="space-y-5 text-center akk-fade">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand/20 border-t-accent" />
            <p className="text-sm font-medium text-muted">
              Analyse du document en cours…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!analyzed) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 px-6 py-10">
          <div className="mx-auto max-w-3xl space-y-8 akk-fade">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-dark">
                Proposition technique &amp; financière
              </p>
              <h1 className="text-3xl font-black tracking-tight text-brand">
                Générateur de proposition
              </h1>
              <p className="max-w-xl text-sm text-muted">
                Importez le cahier des charges et le profil candidat : la
                proposition est pré-remplie automatiquement, prête à être
                ajustée.
              </p>
            </div>
            <UploadForm onSubmit={handleUpload} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto flex max-w-6xl gap-8">
          <div className="min-w-0 flex-1 akk-fade">
            <div className="mb-8 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-dark">
                Proposition
              </p>
              <h1 className="text-2xl font-black tracking-tight text-brand">
                Proposition Technique et Financière
              </h1>
            </div>
            <FormProvider {...ptfForm}>
              <form className="space-y-8">
                <PtfForm register={ptfForm.register} control={ptfForm.control} />
              </form>
            </FormProvider>
          </div>
          <aside className="hidden w-52 shrink-0 lg:block">
            <SectionNav />
          </aside>
        </div>
      </main>
    </div>
  );
}

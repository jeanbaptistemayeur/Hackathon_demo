"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm, FormProvider } from "react-hook-form";
import { UploadForm } from "./components/UploadForm";
import { PtfForm } from "./components/PtfForm";
import { SectionNav } from "./components/SectionNav";
import { ExportButtons } from "./components/export/ExportButtons";
import { ptfFormSchema, type PtfFormData } from "./schemas/ptf-form.schema";
import type { AnalyzeSpecFormData } from "./schemas/analyze-spec.schema";

const STORAGE_KEY = "akk-ptf-state-v1";

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
  const [hydrated, setHydrated] = useState(false);

  const ptfForm = useForm<PtfFormData>({
    defaultValues: ptfFormSchema.parse({}),
  });

  // Restaure l'état sauvegardé au chargement (persistance F5).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          analyzed?: boolean;
          data?: Partial<PtfFormData>;
        };
        if (saved.analyzed && saved.data) {
          ptfForm.reset({ ...ptfFormSchema.parse({}), ...saved.data });
          setAnalyzed(true);
        }
      }
    } catch {
      // Données corrompues : on ignore et on repart de zéro.
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sauvegarde à chaque modification une fois la proposition affichée.
  useEffect(() => {
    if (!hydrated || !analyzed) return;
    const subscription = ptfForm.watch((values) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ analyzed: true, data: values }),
        );
      } catch {
        // Quota dépassé ou stockage indisponible : on ignore.
      }
    });
    // Sauvegarde immédiate de l'état courant.
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ analyzed: true, data: ptfForm.getValues() }),
      );
    } catch {
      // ignore
    }
    return () => subscription.unsubscribe();
  }, [hydrated, analyzed, ptfForm]);

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    ptfForm.reset(ptfFormSchema.parse({}));
    setAnalyzed(false);
  };

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
      const defaults = ptfFormSchema.parse({});
      ptfForm.reset({
        ...defaults,
        ...specifications,
        ...profiles,
        ai_usage: defaults.ai_usage,
      });
    }

    setLoading(false);
    setAnalyzed(true);
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="mx-auto animate-spin akk-spinner" />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="space-y-5 text-center akk-fade">
            <div className="mx-auto animate-spin akk-spinner" />
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
        <FormProvider {...ptfForm}>
          <div className="mx-auto flex max-w-6xl gap-8">
            <div className="min-w-0 flex-1 akk-fade">
              <div className="akk-doc">
                <header className="akk-doc-header">
                  <div className="akk-doc-header-text">
                    <h1 className="akk-doc-title">
                      Proposition Technique et Financière
                    </h1>
                    <p className="akk-doc-subtitle">
                      {ptfForm.watch("client_name")?.trim() ||
                        "Akkodis · Proposition commerciale"}
                    </p>
                  </div>
                  <span className="akk-doc-logo">
                    <Image
                      src="/akkodis-logo.png"
                      alt="Akkodis"
                      width={132}
                      height={32}
                      className="h-7 w-auto"
                    />
                  </span>
                </header>
                <div className="akk-doc-body">
                  <form>
                    <PtfForm
                      register={ptfForm.register}
                      control={ptfForm.control}
                    />
                  </form>
                </div>
              </div>
            </div>
            <aside className="hidden w-56 shrink-0 lg:block">
              <SectionNav
                footer={
                  <div className="space-y-2">
                    <ExportButtons />
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full rounded-md border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-brand hover:text-brand"
                    >
                      Nouvelle proposition
                    </button>
                  </div>
                }
              />
            </aside>
          </div>
        </FormProvider>
      </main>
    </div>
  );
}

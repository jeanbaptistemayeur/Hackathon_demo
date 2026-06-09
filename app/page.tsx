"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { UploadForm } from "./components/UploadForm";
import { PtfForm } from "./components/PtfForm";
import { SectionNav } from "./components/SectionNav";
import { ptfFormSchema, type PtfFormData } from "./schemas/ptf-form.schema";
import type { AnalyzeSpecFormData } from "./schemas/analyze-spec.schema";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-600">Analyse en cours...</p>
        </div>
      </div>
    );
  }

  if (!analyzed) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Proposal Generator
          </h1>
          <UploadForm onSubmit={handleUpload} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto flex gap-8">
        <main className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Proposition Technique et Financière
          </h1>
          <form className="space-y-8">
            <PtfForm register={ptfForm.register} control={ptfForm.control} />
          </form>
        </main>
        <aside className="w-48 shrink-0 hidden lg:block">
          <SectionNav />
        </aside>
      </div>
    </div>
  );
}

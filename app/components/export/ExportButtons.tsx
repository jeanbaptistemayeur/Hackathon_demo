"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { PtfFormData } from "../../schemas/ptf-form.schema";
import { generatePtfDocx } from "../../lib/docx-export";
import { generatePtfPdf } from "../../lib/pdf-export";
import { downloadBlob, ptfFileBase } from "../../lib/ptf-content";

type Busy = null | "pdf" | "docx";

export function ExportButtons() {
  const { getValues } = useFormContext<PtfFormData>();
  const [busy, setBusy] = useState<Busy>(null);

  const run = async (kind: "pdf" | "docx") => {
    if (busy) return;
    setBusy(kind);
    try {
      const data = getValues();
      const base = ptfFileBase(data);
      if (kind === "pdf") {
        const blob = await generatePtfPdf(data);
        downloadBlob(blob, `PTF-${base}.pdf`);
      } else {
        const blob = await generatePtfDocx(data);
        downloadBlob(blob, `PTF-${base}.docx`);
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => run("pdf")}
        disabled={busy !== null}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white shadow-[var(--shadow-brand-sm)] transition-all hover:bg-brand-medium disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span aria-hidden>{busy === "pdf" ? "⏳" : "📄"}</span>
        {busy === "pdf" ? "Génération…" : "Générer le PDF"}
      </button>
      <button
        type="button"
        onClick={() => run("docx")}
        disabled={busy !== null}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand/30 bg-white px-3 py-2 text-xs font-bold text-brand transition-all hover:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span aria-hidden>{busy === "docx" ? "⏳" : "📝"}</span>
        {busy === "docx" ? "Génération…" : "Générer le Word"}
      </button>
    </div>
  );
}

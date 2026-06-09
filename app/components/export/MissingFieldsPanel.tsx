"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { PtfFormData } from "../../schemas/ptf-form.schema";
import {
  ESSENTIAL_FIELDS,
  type EssentialField,
} from "../../lib/required-fields";

function isMissing(field: EssentialField, value: unknown): boolean {
  if (field.kind === "number") {
    return !value || Number(value) === 0;
  }
  return typeof value !== "string" || value.trim() === "";
}

function focusField(field: EssentialField) {
  const el =
    (document.querySelector(
      `[name="${field.name}"]`,
    ) as HTMLElement | null) ?? document.getElementById(field.sectionId);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  const input = el as HTMLInputElement;
  if (typeof input.focus === "function") {
    window.setTimeout(() => input.focus({ preventScroll: true }), 350);
  }
  el.classList.add("akk-field-flash");
  window.setTimeout(() => el.classList.remove("akk-field-flash"), 1600);
}

export function MissingFieldsPanel() {
  const { control } = useFormContext<PtfFormData>();
  // Suit en direct uniquement les champs essentiels.
  const values = useWatch({
    control,
    name: ESSENTIAL_FIELDS.map((f) => f.name),
  });

  const missing = ESSENTIAL_FIELDS.filter((field, index) =>
    isMissing(field, values[index]),
  );

  if (missing.length === 0) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
        <span aria-hidden>✓ </span>
        Tous les champs essentiels sont renseignés.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-3">
      <p className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
        <span aria-hidden>⚠️</span>
        {missing.length === 1
          ? "1 champ essentiel à compléter"
          : `${missing.length} champs essentiels à compléter`}
      </p>
      <ul className="mt-2 space-y-1">
        {missing.map((field) => (
          <li key={String(field.name)}>
            <button
              type="button"
              onClick={() => focusField(field)}
              className="flex w-full items-center justify-between gap-2 rounded-md border border-amber-200 bg-white px-2 py-1 text-left text-xs font-medium text-amber-900 transition hover:border-amber-400 hover:bg-amber-100"
            >
              <span>{field.label}</span>
              <span aria-hidden className="text-[10px] text-amber-500">
                →
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

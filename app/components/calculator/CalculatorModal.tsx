"use client";

import { useEffect, useMemo, useState } from "react";
import { Field } from "../ui/Field";
import { SelectField } from "../ui/SelectField";
import {
  computeCalculator,
  DEFAULT_CALCULATOR_INPUT,
  formatCurrency,
  formatPercent,
  IT_PROFILES,
  LOCAUX_COST,
  type CalculatorInput,
  type CalculatorResult,
  type TariffRow,
} from "../../lib/calculator";

interface CalculatorModalProps {
  /** Computed lazily when the modal opens, so it reflects the latest form data. */
  getInitialValues: () => Partial<CalculatorInput>;
  /** Called when the user validates the calculation. */
  onApply: (result: CalculatorResult, input: CalculatorInput) => void;
}

const LOCAUX_OPTIONS = [
  { value: "", label: "— Sélectionner —" },
  ...Object.keys(LOCAUX_COST).map((site) => ({ value: site, label: site })),
];

const IT_OPTIONS = [
  { value: "", label: "— Aucun —" },
  ...IT_PROFILES.map((p) => ({ value: p.value, label: p.label })),
];

const DELIVERY_OPTIONS = [
  { value: "tjmInSitu", label: "In Situ" },
  { value: "tjmExSitu", label: "Ex Situ" },
  { value: "tjmOffshore", label: "Offshore" },
];

export function CalculatorModal({ getInitialValues, onApply }: CalculatorModalProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_CALCULATOR_INPUT);
  const [tariffRows, setTariffRows] = useState<TariffRow[]>([]);

  useEffect(() => {
    if (!open || tariffRows.length > 0) return;
    let active = true;
    fetch("/tariff-grid.json")
      .then((res) => res.json())
      .then((payload) => {
        if (active) setTariffRows(payload.rows ?? []);
      })
      .catch(() => {
        if (active) setTariffRows([]);
      });
    return () => {
      active = false;
    };
  }, [open, tariffRows.length]);

  const result = useMemo(() => computeCalculator(input, tariffRows), [input, tariffRows]);

  const handleOpen = () => {
    setInput({ ...DEFAULT_CALCULATOR_INPUT, ...getInitialValues() });
    setOpen(true);
  };

  const set = <K extends keyof CalculatorInput>(key: K, value: CalculatorInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const num =
    <K extends keyof CalculatorInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      set(key, (e.target.value === "" ? 0 : Number(e.target.value)) as CalculatorInput[K]);

  const str =
    <K extends keyof CalculatorInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      set(key, e.target.value as CalculatorInput[K]);

  const isTargetMode = input.pricingMode === "MB souhaitee";
  const onAkkodisSite = input.siteRealisation === "Site AKKODIS";

  const handleApply = () => {
    if (!result.ok) return;
    onApply(result, input);
    setOpen(false);
  };

  const tariffCodeOptions = useMemo(
    () => [
      { value: "", label: "— Aucun —" },
      ...tariffRows.map((row) => ({ value: row.code, label: `${row.family} - ${row.code}` })),
    ],
    [tariffRows],
  );

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-brand shadow-[var(--shadow-brand-sm)] transition-all hover:bg-accent-light hover:shadow-[var(--shadow-brand-md)]"
      >
        <span aria-hidden>🧮</span> Calculatrice tarifaire
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-brand-dark/50 p-4 backdrop-blur-sm akk-fade"
          role="dialog"
          aria-modal="true"
          aria-label="Calculatrice tarifaire"
          onClick={() => setOpen(false)}
        >
          <div
            className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-brand-lg)] akk-pop"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-br from-brand to-brand-medium px-5 py-4 text-white">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent-light">
                  Akkodis · EOD
                </p>
                <h2 className="text-lg font-bold">Calculatrice tarifaire</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-brand">
                  {isTargetMode ? "TJM cible" : "Marge"}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] space-y-4 overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Prénom *"
                  value={input.firstName}
                  onChange={str("firstName")}
                  placeholder="Prénom"
                />
                <Field
                  label="Nom *"
                  value={input.lastName}
                  onChange={str("lastName")}
                  placeholder="NOM"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Interne / externe *"
                  value={input.resourceType}
                  onChange={str("resourceType")}
                  options={[
                    { value: "Interne", label: "Interne" },
                    { value: "externe", label: "Externe" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Date de démarrage *"
                  type="date"
                  value={input.startDate}
                  onChange={str("startDate")}
                />
                <Field
                  label="Date de fin *"
                  type="date"
                  value={input.endDate}
                  onChange={str("endDate")}
                />
              </div>

              <Field
                label="Salaire brut annuel (€) *"
                type="number"
                value={input.salaryAnnual}
                onChange={num("salaryAnnual")}
              />

              {/* Mode de calcul */}
              <div>
                <span className="akk-label">Mode de calcul *</span>
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1">
                  {(["TJM", "MB souhaitee"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => set("pricingMode", m)}
                      className={`rounded-lg px-3 py-2 text-sm font-bold transition-all ${
                        input.pricingMode === m
                          ? "bg-white text-brand shadow-[var(--shadow-brand-sm)]"
                          : "text-muted hover:text-brand"
                      }`}
                    >
                      {m === "TJM" ? "TJM → Marge" : "Marge cible → TJM"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {!isTargetMode ? (
                  <Field
                    label="TJM saisi (€/j)"
                    type="number"
                    value={input.tjmInput}
                    onChange={num("tjmInput")}
                  />
                ) : (
                  <Field
                    label="Taux de marge souhaité (%)"
                    type="number"
                    value={input.targetMarginPct}
                    onChange={num("targetMarginPct")}
                  />
                )}
              </div>

              {/* Paramètres optionnels */}
              <details className="rounded-xl border border-line bg-canvas/40 px-3 py-2">
                <summary className="cursor-pointer text-sm font-bold text-brand-medium">
                  Paramètres optionnels
                </summary>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Field label="Temps partiel (0-1)" type="number" value={input.partTime} onChange={num("partTime")} />
                  <Field label="Jours gratuits" type="number" value={input.freeDays} onChange={num("freeDays")} />
                  <Field label="Congés N" type="number" value={input.leaveY0} onChange={num("leaveY0")} />
                  <Field label="Congés N+1" type="number" value={input.leaveY1} onChange={num("leaveY1")} />
                  <Field label="Congés N+2" type="number" value={input.leaveY2} onChange={num("leaveY2")} />
                  <Field label="CJ SST (€/j)" type="number" value={input.cjSst} onChange={num("cjSst")} />
                  <Field label="CA autre (€)" type="number" value={input.caOther} onChange={num("caOther")} />
                  <Field label="Coûts production (€)" type="number" value={input.productionCost} onChange={num("productionCost")} />
                  <Field label="Frais déplacement (€)" type="number" value={input.travelCost} onChange={num("travelCost")} />
                  <Field label="CA frais refacturé (€)" type="number" value={input.travelRefact} onChange={num("travelRefact")} />
                </div>

                <h4 className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-medium">Locaux</h4>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <SelectField
                    label="Site de réalisation"
                    value={input.siteRealisation}
                    onChange={str("siteRealisation")}
                    options={[
                      { value: "Site Client", label: "Site Client" },
                      { value: "Site AKKODIS", label: "Site AKKODIS" },
                    ]}
                  />
                  {onAkkodisSite && (
                    <SelectField
                      label="Locaux AKKODIS"
                      value={input.locauxAkkodis}
                      onChange={str("locauxAkkodis")}
                      options={LOCAUX_OPTIONS}
                    />
                  )}
                  {onAkkodisSite && (
                    <Field
                      label="Taux d'occupation (%)"
                      type="number"
                      value={input.occupancyRate}
                      onChange={num("occupancyRate")}
                    />
                  )}
                </div>

                <h4 className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-medium">Coûts IT / Téléphonie</h4>
                <div className="mt-2">
                  <SelectField
                    label="Profil IT"
                    value={input.itProfile}
                    onChange={str("itProfile")}
                    options={IT_OPTIONS}
                  />
                </div>

                <h4 className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-medium">Contrôle grille</h4>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <SelectField
                    label="Code grille (contrôle TJM)"
                    value={input.serviceCode}
                    onChange={str("serviceCode")}
                    options={tariffCodeOptions}
                  />
                  <SelectField
                    label="Contexte mission"
                    value={input.deliveryMode}
                    onChange={str("deliveryMode")}
                    options={DELIVERY_OPTIONS}
                  />
                </div>
              </details>

              {/* Paramètres techniques */}
              <details className="rounded-xl border border-line bg-canvas/40 px-3 py-2">
                <summary className="cursor-pointer text-sm font-bold text-brand-medium">
                  Paramètres techniques
                </summary>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Field label="RFA (%)" type="number" value={input.rfaPct} onChange={num("rfaPct")} />
                  <Field label="Taux charge bas" type="number" value={input.chargeLow} onChange={num("chargeLow")} />
                  <Field label="Taux charge haut" type="number" value={input.chargeHigh} onChange={num("chargeHigh")} />
                  <Field label="Salaire pivot (€)" type="number" value={input.salaryPivot} onChange={num("salaryPivot")} />
                  <Field label="Augmentation annuelle" type="number" value={input.annualIncrease} onChange={num("annualIncrease")} />
                </div>
              </details>
            </div>

            {/* Result */}
            <div className="space-y-3 border-t border-line bg-canvas/60 px-5 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-line bg-white p-3 shadow-[var(--shadow-brand-sm)]">
                  <p className="text-xs text-muted">Marge brute projet</p>
                  <strong className="text-xl text-brand">
                    {result.ok ? formatCurrency(result.marginAmount) : "—"}
                  </strong>
                </div>
                <div className="rounded-xl border border-accent-dark/40 bg-gradient-to-b from-white to-accent/15 p-3 shadow-[var(--shadow-brand-sm)]">
                  <p className="text-xs text-muted">Taux de marge brute</p>
                  <strong className="text-xl text-brand">
                    {result.ok ? formatPercent(result.marginPct) : "—"}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm font-medium text-muted">
                <span>{isTargetMode ? "TJM cible calculé" : "TJM saisi"}</span>
                <span className="text-base font-bold text-brand">
                  {result.ok ? formatCurrency(result.tjm) : "—"}
                </span>
              </div>

              {!result.ok && result.message && (
                <div className="rounded-lg bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
                  {result.message}
                </div>
              )}

              {result.ok && result.tariffAlert && (
                <div
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    result.tariffAlert.status === "ok"
                      ? "bg-success/10 text-success"
                      : result.tariffAlert.status === "danger"
                        ? "bg-error/10 text-error"
                        : "bg-warning/10 text-warning"
                  }`}
                >
                  {result.tariffAlert.text}
                </div>
              )}

              {result.ok && (
                <details className="rounded-xl border border-line bg-white px-3 py-2">
                  <summary className="cursor-pointer text-xs font-bold text-brand-medium">
                    Détail du calcul
                  </summary>
                  <table className="mt-2 w-full text-xs">
                    <tbody>
                      {result.details.map(([label, value]) => (
                        <tr key={label} className="border-b border-line/60 last:border-0">
                          <td className="py-1.5 pr-2 text-muted">{label}</td>
                          <td className="py-1.5 text-right font-semibold text-brand">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-canvas"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={!result.ok}
                  className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-brand-sm)] transition-all hover:bg-brand-medium disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                  Appliquer à la proposition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

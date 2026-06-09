import {
  EXPENSES_POLICY_OPTIONS,
  LOGISTICS_PROVIDER_OPTIONS,
  REQUIREMENTS_STATEMENT_OPTIONS,
  RISK_STATEMENT_OPTIONS,
  type PtfFormData,
} from "../schemas/ptf-form.schema";

// Couleurs charte Akkodis (hex sans #)
export const COLORS = {
  brand: "1E3A5F",
  brandMedium: "2C5282",
  accent: "FDB913",
  line: "DCE5F2",
  ink: "1A202C",
  muted: "5A6B82",
} as const;

const COMPLIANCE_LABELS: Record<string, string> = {
  C: "Conforme",
  PC: "Partiellement conforme",
  NC: "Non conforme",
  NA: "Non applicable",
};

export type EncartRow = { label: string; value: string };

export type Block =
  | { type: "titlePage"; title: string; subtitle?: string; org?: string }
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "kv"; label: string; value: string }
  | { type: "bullet"; text: string }
  | { type: "table"; headers: string[]; rows: string[][]; widths?: number[] }
  | { type: "encart"; title?: string; rows: EncartRow[] }
  | { type: "signature"; client: EncartRow[]; provider: EncartRow[] }
  | { type: "image"; src: string; format: "png" | "jpeg"; fullPage?: boolean }
  | { type: "spacer" };

// Textes statiques repris du modèle Akkodis (PTF) — sections 3.3 à fin.
export const STATIC_TEXT = {
  billingFrequency: "La facturation est mensuelle au prorata des jours de prestation réalisés.",
  billingReserve:
    "Le Client dispose d'un délai de 30 (trente) jours à compter de la réception du rapport mensuel d'activités / du livrable pour émettre des réserves, le cas échéant, sur ce dernier. À défaut de réserve émise dans le délai précité, le rapport mensuel d'activités / livrable sera considéré comme tacitement accepté.",
  billingNoOrder:
    "L'absence de commande n'empêche pas le Prestataire d'émettre la facture correspondante pour les prestations réalisées.",
  paymentCalendar:
    "En l'absence d'accord cadre applicable à la prestation, le paiement est effectué à 45 jours fin de mois à compter de la date à laquelle la facture a été émise. Le règlement des factures se fait par virement bancaire.",
  orderManagementPrefix: "La commande devra être transmise au courriel suivant : ",
  defaultOrderEmail: "bdc@akkodis.com",
  rateRevision:
    "En l'absence d'accord cadre applicable à la prestation, pour les prestations qui sont facturées sur la base du temps passé, ou sur la base d'unités d'œuvres/unités de valeur, et dont la durée est supérieure à un an (durée initiale de prestations ou durée renouvelée), les taux journaliers ou les tarifs appliqués à des unités d'œuvre/unités de valeurs figurant dans la proposition technique et financière sont indexés sur l'indice SYNTEC. Ils seront automatiquement révisés, au 1er janvier de chaque année par application de la formule P = P0 × S1/S0 dans laquelle P est le montant révisé, P0 le montant initial ou issu de la dernière révision, S0 la valeur de l'indice en vigueur à la date d'entrée en vigueur de la prestation Contrat ou lors de la dernière révision, S1 la dernière valeur disponible de l'indice pour l'année considérée. Si l'indice venait à disparaître, les Parties lui substitueront un indice de remplacement. À défaut d'accord, un nouvel indice sera choisi par le Président du Tribunal de commerce du siège social de la société émettrice de la PTF.",
} as const;

// Images statiques du modèle, copiées dans public/template.
export const CGV_IMAGES = [
  "/template/cgv-1.jpg",
  "/template/cgv-2.jpg",
  "/template/cgv-3.jpg",
  "/template/cgv-4.jpg",
] as const;
export const ENVIRONMENT_POLICY_IMAGE = "/template/environment-policy.png";

function optionLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string | undefined,
): string {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function fmtNumber(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return "";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(
    value,
  );
}

function fmtCurrency(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return "";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Construit la liste ordonnée de blocs représentant la proposition.
 * Ce modèle est rendu à l'identique en DOCX et en PDF.
 */
export function buildPtfBlocks(data: PtfFormData): Block[] {
  const blocks: Block[] = [];
  const push = (...items: (Block | false | null | undefined)[]) => {
    for (const it of items) if (it) blocks.push(it);
  };
  const h1 = (text: string): Block => ({ type: "h1", text });
  const h2 = (text: string): Block => ({ type: "h2", text });
  const h3 = (text: string): Block => ({ type: "h3", text });
  const p = (text: string): Block => ({ type: "p", text });
  const kv = (label: string, value: string): Block => ({ type: "kv", label, value });
  const bullet = (text: string): Block => ({ type: "bullet", text });
  const table = (headers: string[], rows: string[][], widths?: number[]): Block => ({
    type: "table",
    headers,
    rows,
    widths,
  });
  const spacer = (): Block => ({ type: "spacer" });
  const encart = (rows: EncartRow[], title?: string): Block => ({
    type: "encart",
    title,
    rows,
  });
  const image = (src: string, format: "png" | "jpeg", fullPage = true): Block => ({
    type: "image",
    src,
    format,
    fullPage,
  });

  // ---- Page de titre ----
  push({
    type: "titlePage",
    title: "Proposition Technique et Financière",
    subtitle: hasText(data.project_title)
      ? data.project_title
      : hasText(data.client_name)
        ? data.client_name
        : undefined,
    org:
      hasText(data.project_title) && hasText(data.client_name)
        ? data.client_name
        : undefined,
  });

  // ---- Description / références ----
  push(h1("Description"));
  const descPairs: [string, string | undefined][] = [
    ["Titre du projet", data.project_title],
    ["Nom du client", data.client_name],
    ["N° RCS client", data.client_rcs],
    ["Référence cahier des charges", data.spec_reference],
    ["Nature du document", data.document_nature],
    ["Référence de l'offre", data.offer_reference],
    ["Date de l'offre", data.offer_date],
    ["Date de validité", data.validity_date],
    ["Validé par", data.validated_by],
    ["Entité Akkodis (facturation)", data.akkodis_entity],
    ["Devise", data.currency],
    ["Contrat cadre", data.framework_contract],
  ];
  for (const [label, value] of descPairs) {
    if (hasText(value)) push(kv(label, value));
  }

  // ---- Suivi des versions ----
  push(h1("Suivi des versions"));
  if (hasText(data.version)) push(kv("Version", data.version));
  if (hasText(data.offer_date)) push(kv("Date de l'offre", data.offer_date));
  if (hasText(data.version_notes)) push(p(data.version_notes));

  // ---- 1 Compréhension des enjeux ----
  push(h1("1 Compréhension des enjeux"));

  push(h2("1.1 Documents applicables"));
  if (hasText(data.applicable_documents)) push(p(data.applicable_documents));

  push(h2("1.2 Principales exigences"));
  if (hasText(data.business_segment)) push(kv("Segment métier", data.business_segment));
  if (hasText(data.nf_code)) push(kv("Code NF", data.nf_code));
  if (hasText(data.context_overview)) push(p(data.context_overview));
  if (hasText(data.main_mission)) push(p(data.main_mission));

  push(h2("1.3 Localisation et plage d'intervention de la prestation"));
  if (hasText(data.location)) push(kv("Localisation", data.location));
  if (hasText(data.service_window)) push(kv("Plage d'intervention", data.service_window));
  for (const addr of data.location_address ?? []) {
    if (hasText(addr)) push(bullet(addr));
  }

  push(h2("1.4 Durée de la prestation"));
  if (hasText(data.mission_start_date) || hasText(data.mission_end_date)) {
    push(
      p(
        `La prestation est prévue du ${data.mission_start_date || "[date]"} au ${
          data.mission_end_date || "[date]"
        }.`,
      ),
    );
  }

  push(h2("1.5 Moyens logistiques"));
  {
    const logistics = optionLabel(LOGISTICS_PROVIDER_OPTIONS, data.logistics_provider);
    if (hasText(logistics)) push(p(logistics));
  }

  push(h2("1.6 Prévention"));
  push(kv("EPI requis", data.ppe_required ? "Oui" : "Non"));
  if (hasText(data.ppe_details)) push(kv("Détail EPI", data.ppe_details));
  push(kv("Habilitation requise", data.clearance_required ? "Oui" : "Non"));
  if (hasText(data.clearance_details)) push(kv("Détail habilitation", data.clearance_details));
  if (hasText(data.prevention_measures)) push(p(data.prevention_measures));

  push(h2("1.7 Export Control"));
  push(p(data.export_control ? "Export Control identifié." : "Aucun Export Control identifié."));

  push(h2("1.8 RGPD"));
  push(
    p(
      data.gdpr_applicable
        ? "Les prestations impliquent un traitement de données personnelles (RGPD applicable)."
        : "Les prestations n'impliquent pas de traitement de données personnelles.",
    ),
  );

  push(h2("1.9 Intelligence Artificielle"));
  if (hasText(data.ai_usage)) push(p(data.ai_usage));

  push(h2("1.10 ENVIRONNEMENT"));
  if (data.fte_count) push(kv("Nombre d'ETP", fmtNumber(data.fte_count)));
  if (hasText(data.carbon_impact)) push(kv("Impact carbone (tCO2eq)", data.carbon_impact));

  push(h3("1.10.1 Calcul des émissions de GES projet"));
  if (hasText(data.ges_method)) push(p(data.ges_method));
  if (hasText(data.carbon_cost_note)) push(p(data.carbon_cost_note));
  if (hasText(data.env_management)) push(p(data.env_management));

  // ---- 2 Proposition technique ----
  push(h1("2 Proposition technique"));

  push(h2("2.1 Points forts de la proposition"));
  for (const item of data.proposal_highlights ?? []) {
    if (hasText(item)) push(bullet(item));
  }

  push(h2("2.2 Organisation du projet"));
  {
    const candidate = `${data.candidate_firstName ?? ""} ${data.candidate_lastName ?? ""}`.trim();
    if (candidate) push(kv("Candidat", candidate));
    if (hasText(data.candidate_function)) push(kv("Fonction candidat", data.candidate_function));
    if (hasText(data.client_manager_name)) push(kv("Chargé d'affaire client", data.client_manager_name));
    if (hasText(data.team_manager_name)) push(kv("Responsable équipe", data.team_manager_name));
    if (hasText(data.team_manager_function)) push(kv("Fonction responsable", data.team_manager_function));
  }

  push(h2("2.3 Recours à la sous-traitance interne Akkodis"));
  if (hasText(data.internal_subcontracting)) push(p(data.internal_subcontracting));

  push(h2("2.4 Recours à la sous-traitance externe"));
  for (const item of data.external_subcontractors ?? []) {
    if (hasText(item)) push(bullet(item));
  }

  push(h2("2.5 Pilotage de la prestation"));
  if (hasText(data.service_monitoring)) push(p(data.service_monitoring));

  push(h2("2.6 Réponse aux exigences"));
  {
    const statement = optionLabel(REQUIREMENTS_STATEMENT_OPTIONS, data.requirements_statement);
    if (hasText(statement)) push(p(statement));
    const rows = (data.requirements_matrix ?? [])
      .filter((r) => hasText(r.chapter_reference) || hasText(r.chapter_name) || hasText(r.comment))
      .map((r) => [
        r.chapter_reference ?? "",
        r.chapter_name ?? "",
        COMPLIANCE_LABELS[r.compliance_status ?? "C"] ?? (r.compliance_status ?? ""),
        r.comment ?? "",
      ]);
    if (rows.length) {
      push(
        table(["Réf.", "Chapitre", "Conformité", "Commentaire"], rows, [12, 33, 20, 35]),
        spacer(),
      );
    }
  }

  push(h2("2.7 Principaux risques"));
  {
    const statement = optionLabel(RISK_STATEMENT_OPTIONS, data.risks_statement);
    if (hasText(statement)) push(p(statement));
    const rows = (data.risks ?? [])
      .filter((r) => hasText(r.risk_nature) || hasText(r.mitigation_plan) || hasText(r.comment))
      .map((r) => [r.risk_nature ?? "", r.mitigation_plan ?? "", r.comment ?? ""]);
    if (rows.length) {
      push(
        table(["Nature du risque", "Plan de mitigation", "Commentaire"], rows, [33, 40, 27]),
        spacer(),
      );
    }
  }

  push(h2("2.8 Compétences"));
  if (hasText(data.skills_description)) push(p(data.skills_description));
  {
    const rows = (data.skills ?? [])
      .filter((s) => hasText(s.name))
      .map((s) => [s.name ?? "", `${s.rating ?? 0} / 5`]);
    if (rows.length) {
      push(table(["Compétence", "Niveau"], rows, [70, 30]), spacer());
    }
  }

  // ---- 3 Proposition financière ----
  push(h1("3 Proposition financière"));

  push(h2("3.1 Prix"));
  push(p("Tous les prix indiqués s'entendent hors TVA."));
  {
    // Encart projet (repris du modèle : Projet / Réf CDC / Client)
    const encartRows: EncartRow[] = [];
    if (hasText(data.project_title)) encartRows.push({ label: "Projet", value: data.project_title });
    if (hasText(data.spec_reference))
      encartRows.push({ label: "Réf. CDC", value: data.spec_reference });
    if (hasText(data.client_name)) encartRows.push({ label: "Client", value: data.client_name });
    if (encartRows.length) push(encart(encartRows));
  }
  {
    const rows = (data.pricing_lots ?? [])
      .filter((l) => hasText(l.lot_name) || l.lot_price)
      .map((l) => [
        l.lot_name ?? "",
        l.description ?? "",
        l.nf_code ?? "",
        fmtCurrency(l.daily_rate),
        fmtNumber(l.production_days),
        fmtCurrency(l.lot_price),
      ]);
    if (rows.length) {
      push(
        table(
          ["Lot", "Description", "Code NF", "TJM", "Jours", "Prix lot"],
          rows,
          [22, 26, 12, 14, 10, 16],
        ),
        spacer(),
      );
    }
    if (data.commercial_discount_percent)
      push(kv("Remise commerciale", `${fmtNumber(data.commercial_discount_percent)} %`));
    if (data.total_price_ht) push(kv("Total HT", fmtCurrency(data.total_price_ht)));
    if (data.total_production_days)
      push(kv("Jours de production totaux", fmtNumber(data.total_production_days)));
  }

  push(h2("3.2 Frais"));
  {
    const policy = optionLabel(EXPENSES_POLICY_OPTIONS, data.expenses_policy);
    if (hasText(policy)) push(p(policy));
    if (hasText(data.ancillary_expenses?.details))
      push(kv("Frais annexes", data.ancillary_expenses.details));
    if (data.ancillary_expenses?.total)
      push(kv("Total frais annexes", fmtCurrency(data.ancillary_expenses.total)));
    if (hasText(data.license_fees?.details))
      push(kv("Licences", data.license_fees.details));
    if (data.license_fees?.total)
      push(kv("Total licences", fmtCurrency(data.license_fees.total)));
  }

  push(h2("3.3 Facturation"));
  {
    // Contenu statique repris du modèle
    push(p(STATIC_TEXT.billingFrequency));
    push(p("Échéancier de facturation :"));
    const rows = (data.billing_schedule_entries ?? [])
      .filter((e) => hasText(e.tranche_name) || e.due_amount)
      .map((e, i) => [
        String(i + 1),
        e.tranche_name ?? "",
        fmtCurrency(e.tranche_total),
        e.due_date ?? "",
        fmtCurrency(e.due_amount),
      ]);
    if (rows.length) {
      push(
        table(
          ["N°", "Tranche", "Montant total tranche (€ HT)", "Échéance", "Montant échéance (€ HT)"],
          rows,
          [8, 28, 24, 16, 24],
        ),
        spacer(),
      );
    }
    push(p(STATIC_TEXT.billingReserve));
    push(p(STATIC_TEXT.billingNoOrder));
  }

  push(h2("3.4 Calendrier de paiement"));
  push(p(STATIC_TEXT.paymentCalendar));

  push(h2("3.5 Gestion des commandes"));
  push(
    p(
      STATIC_TEXT.orderManagementPrefix +
        (hasText(data.order_email) ? data.order_email : STATIC_TEXT.defaultOrderEmail),
    ),
  );

  push(h2("3.6 CGV"));
  {
    for (const src of CGV_IMAGES) push(image(src, "jpeg"));
  }

  push(h2("3.7 Révision des taux journaliers et des tarifs"));
  push(p(STATIC_TEXT.rateRevision));

  push(h2("3.8 Signature"));
  push({
    type: "signature",
    client: [
      { label: "Signataire", value: "" },
      {
        label: "Prénom, nom",
        value: hasText(data.client_signatory_name) ? data.client_signatory_name : "",
      },
      {
        label: "Fonction",
        value: hasText(data.client_signatory_function) ? data.client_signatory_function : "",
      },
    ],
    provider: [
      { label: "Signataire", value: "" },
      {
        label: "Prénom, nom",
        value: hasText(data.akkodis_signatory_name) ? data.akkodis_signatory_name : "",
      },
      {
        label: "Fonction",
        value: hasText(data.akkodis_signatory_function) ? data.akkodis_signatory_function : "",
      },
    ],
  });

  // ---- Annexe ----
  push(h1("Annexe 1 · Politique environnement"));
  push(image(ENVIRONMENT_POLICY_IMAGE, "png"));

  return blocks;
}

/**
 * Construit un nom de fichier slugifié à partir des données de la proposition.
 */
export function ptfFileBase(data: PtfFormData): string {
  const raw = data.project_title || data.client_name || "proposition";
  const slug = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return slug || "proposition";
}

/**
 * Charge une image depuis /public et renvoie ses données (dataURL + ArrayBuffer + dimensions).
 * Renvoie null si le chargement échoue (l'export se poursuit sans l'image).
 */
export type LoadedImage = {
  dataUrl: string;
  arrayBuffer: ArrayBuffer;
  width: number;
  height: number;
};

export async function loadImage(path: string): Promise<LoadedImage | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const { width, height } = await new Promise<{ width: number; height: number }>(
      (resolve) => {
        const img = new globalThis.Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => resolve({ width: 1480, height: 440 });
        img.src = dataUrl;
      },
    );
    return { dataUrl, arrayBuffer, width, height };
  } catch {
    return null;
  }
}

/** Charge le logo Akkodis. */
export function loadLogo(): Promise<LoadedImage | null> {
  return loadImage("/akkodis-logo.png");
}

/** Charge toutes les images référencées par les blocs (clé = src). */
export async function loadBlockImages(
  blocks: Block[],
): Promise<Map<string, LoadedImage>> {
  const srcs = Array.from(
    new Set(
      blocks.filter((b): b is Extract<Block, { type: "image" }> => b.type === "image").map((b) => b.src),
    ),
  );
  const map = new Map<string, LoadedImage>();
  await Promise.all(
    srcs.map(async (src) => {
      const img = await loadImage(src);
      if (img) map.set(src, img);
    }),
  );
  return map;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

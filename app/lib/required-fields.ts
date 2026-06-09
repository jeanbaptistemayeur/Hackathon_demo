import type { PtfFormData } from "../schemas/ptf-form.schema";

/**
 * Champ essentiel à renseigner avant de générer la proposition.
 * - `name` : nom du champ react-hook-form (= attribut name de l'input)
 * - `label` : libellé lisible affiché dans la boîte de dialogue
 * - `sectionId` : ancre de la section pour le contexte
 * - `kind` : "text" (vide = manquant) ou "number" (0 = manquant)
 */
export interface EssentialField {
  name: keyof PtfFormData;
  label: string;
  sectionId: string;
  kind: "text" | "number";
}

export const ESSENTIAL_FIELDS: EssentialField[] = [
  { name: "project_title", label: "Titre du projet", sectionId: "description", kind: "text" },
  { name: "client_name", label: "Nom du client", sectionId: "description", kind: "text" },
  { name: "offer_reference", label: "Référence de l'offre", sectionId: "description", kind: "text" },
  { name: "offer_date", label: "Date de l'offre", sectionId: "description", kind: "text" },
  { name: "mission_start_date", label: "Date de début", sectionId: "enjeux-duree", kind: "text" },
  { name: "mission_end_date", label: "Date de fin", sectionId: "enjeux-duree", kind: "text" },
  { name: "total_price_ht", label: "Montant total HT", sectionId: "financiere-prix", kind: "number" },
];

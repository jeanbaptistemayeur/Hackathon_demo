import type { Control, UseFormRegister } from "react-hook-form";
import type { PtfFormData } from "../../schemas/ptf-form.schema";

export interface SectionFormProps {
  register: UseFormRegister<PtfFormData>;
  control: Control<PtfFormData>;
}

export interface PtfNavItem {
  id: string;
  label: string;
  children?: PtfNavItem[];
}

export const PTF_SECTIONS: PtfNavItem[] = [
  { id: "description", label: "Description" },
  { id: "versions", label: "Suivi des versions" },
  {
    id: "enjeux",
    label: "1 Compréhension des enjeux",
    children: [
      { id: "enjeux-documents", label: "1.1 Documents applicables" },
      { id: "enjeux-exigences", label: "1.2 Principales exigences" },
      {
        id: "enjeux-localisation",
        label: "1.3 Localisation et plage d'intervention de la prestation",
      },
      { id: "enjeux-duree", label: "1.4 Durée de la prestation" },
      { id: "enjeux-logistique", label: "1.5 Moyens logistiques" },
      { id: "enjeux-prevention", label: "1.6 Prévention" },
      { id: "enjeux-export-control", label: "1.7 Export Control" },
      { id: "enjeux-rgpd", label: "1.8 RGPD" },
      { id: "enjeux-ia", label: "1.9 Intelligence Artificielle" },
      {
        id: "enjeux-environnement",
        label: "1.10 ENVIRONNEMENT",
        children: [
          {
            id: "enjeux-ges",
            label: "1.10.1 Calcul des émissions de GES projet",
          },
          { id: "enjeux-methode-calcul", label: "a. Méthode de calcul" },
          { id: "enjeux-cout-carbone", label: "b. Coût carbone du projet" },
          {
            id: "enjeux-management-env",
            label: "1.10.2 Système de management environnemental",
          },
        ],
      },
    ],
  },
  {
    id: "technique",
    label: "2 Proposition technique",
    children: [
      {
        id: "technique-points-forts",
        label: "2.1 Points forts de la proposition",
      },
      { id: "technique-organisation", label: "2.2 Organisation du projet" },
      {
        id: "technique-sous-traitance-interne",
        label: "2.3 Recours à la sous-traitance interne Akkodis",
      },
      {
        id: "technique-sous-traitance-externe",
        label: "2.4 Recours à la sous-traitance externe",
      },
      { id: "technique-pilotage", label: "2.5 Pilotage de la prestation" },
      { id: "technique-exigences", label: "2.6 Réponse aux exigences" },
      { id: "technique-risques", label: "2.7 Principaux risques" },
      { id: "technique-competences", label: "2.8 Compétences" },
    ],
  },
  {
    id: "financiere",
    label: "3 Proposition financière",
    children: [
      { id: "financiere-prix", label: "3.1 Prix" },
      { id: "financiere-frais", label: "3.2 Frais" },
      { id: "financiere-facturation", label: "3.3 Facturation" },
      { id: "financiere-calendrier", label: "3.4 Calendrier de paiement" },
      { id: "financiere-commandes", label: "3.5 Gestion des commandes" },
      { id: "financiere-cgv", label: "3.6 CGV" },
      {
        id: "financiere-revision",
        label: "3.7 Révision des taux journaliers et des tarifs",
      },
      { id: "financiere-signature", label: "3.8 Signature" },
      {
        id: "financiere-annexe-env",
        label: "Annexe 1 · Politique environnement",
      },
    ],
  },
];

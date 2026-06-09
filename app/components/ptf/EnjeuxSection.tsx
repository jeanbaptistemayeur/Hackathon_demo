"use client";

import { Field } from "../ui/Field";
import { TextArea } from "../ui/TextArea";
import { Checkbox } from "../ui/Checkbox";
import { Section, SubSection } from "../ui/Section";
import { StringList } from "./StringList";
import type { SectionFormProps } from "./sections";

export function EnjeuxSection({ register, control }: SectionFormProps) {
  return (
    <Section id="enjeux" title="1 Compréhension des enjeux">
      <SubSection id="enjeux-documents" title="1.1 Documents applicables">
        <TextArea
          label="Documents applicables"
          {...register("applicable_documents")}
        />
      </SubSection>

      <SubSection id="enjeux-exigences" title="1.2 Principales exigences">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Segment métier" {...register("business_segment")} />
          <Field label="Code NF" {...register("nf_code")} />
        </div>
        <TextArea label="Contexte général" {...register("context_overview")} />
        <TextArea label="Mission principale" {...register("main_mission")} />
      </SubSection>

      <SubSection
        id="enjeux-localisation"
        title="1.3 Localisation et plage d'intervention de la prestation"
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Localisation" {...register("location")} />
          <Field label="Plage d'intervention" {...register("service_window")} />
        </div>
        <div className="mt-4">
          <StringList
            register={register}
            control={control}
            name="location_address"
            title="Adresses du site"
            itemLabel="Adresse"
            addLabel="+ Ajouter une adresse"
          />
        </div>
      </SubSection>

      <SubSection id="enjeux-duree" title="1.4 Durée de la prestation">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date de début" {...register("mission_start_date")} />
          <Field label="Date de fin" {...register("mission_end_date")} />
        </div>
      </SubSection>

      <SubSection id="enjeux-logistique" title="1.5 Moyens logistiques">
        <Field label="Moyens logistiques" {...register("logistics_provider")} />
      </SubSection>

      <SubSection id="enjeux-prevention" title="1.6 Prévention">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Checkbox label="EPI requis" {...register("ppe_required")} />
          <Field label="Détail EPI" {...register("ppe_details")} />
          <Checkbox
            label="Habilitation requise"
            {...register("clearance_required")}
          />
          <Field
            label="Détail habilitation"
            {...register("clearance_details")}
          />
        </div>
        <TextArea
          label="Mesures de prévention"
          {...register("prevention_measures")}
        />
      </SubSection>

      <SubSection id="enjeux-export-control" title="1.7 Export Control">
        <Checkbox
          label="Export Control identifié"
          {...register("export_control")}
        />
      </SubSection>

      <SubSection id="enjeux-rgpd" title="1.8 RGPD">
        <Checkbox
          label="Traitement de données personnelles (RGPD)"
          {...register("gdpr_applicable")}
        />
      </SubSection>

      <SubSection id="enjeux-ia" title="1.9 Intelligence Artificielle">
        <TextArea label="Utilisation d'IA" {...register("ai_usage")} />
      </SubSection>

      <SubSection id="enjeux-environnement" title="1.10 ENVIRONNEMENT">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Nombre d'ETP"
            type="number"
            {...register("fte_count", { valueAsNumber: true })}
          />
          <Field
            label="Impact carbone (tCO2eq)"
            {...register("carbon_impact")}
          />
        </div>
      </SubSection>

      <SubSection
        id="enjeux-ges"
        title="1.10.1 Calcul des émissions de GES projet"
      >
        <TextArea
          label="Calcul des émissions de GES"
          {...register("carbon_cost_note")}
        />
      </SubSection>

      <SubSection id="enjeux-methode-calcul" title="a. Méthode de calcul">
        <TextArea label="Méthode de calcul" {...register("ges_method")} />
      </SubSection>

      <SubSection id="enjeux-cout-carbone" title="b. Coût carbone du projet">
        <Field label="Impact carbone (tCO2eq)" {...register("carbon_impact")} />
      </SubSection>

      <SubSection
        id="enjeux-management-env"
        title="1.10.2 Système de management environnemental"
      >
        <TextArea
          label="Système de management environnemental"
          {...register("env_management")}
        />
      </SubSection>
    </Section>
  );
}

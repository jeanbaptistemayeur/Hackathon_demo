"use client";

import { Field } from "../ui/Field";
import { TextArea } from "../ui/TextArea";
import { Section, SubSection } from "../ui/Section";
import { RequirementsList } from "./RequirementsList";
import { RisksList } from "./RisksList";
import { StringList } from "./StringList";
import type { SectionFormProps } from "./sections";

export function TechniqueSection({ register, control }: SectionFormProps) {
  return (
    <Section id="technique" title="2 Proposition technique">
      <SubSection
        id="technique-points-forts"
        title="2.1 Points forts de la proposition"
      >
        <StringList
          register={register}
          control={control}
          name="proposal_highlights"
          title="Points forts"
          itemLabel="Point fort"
          addLabel="+ Ajouter un point fort"
        />
      </SubSection>

      <SubSection
        id="technique-organisation"
        title="2.2 Organisation du projet"
      >
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Field label="Prénom candidat" {...register("candidate_firstName")} />
          <Field label="Nom candidat" {...register("candidate_lastName")} />
          <Field
            label="Fonction candidat"
            {...register("candidate_function")}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field
            label="Chargé d'affaire client"
            {...register("client_manager_name")}
          />
          <Field
            label="Responsable équipe"
            {...register("team_manager_name")}
          />
          <Field
            label="Fonction responsable"
            {...register("team_manager_function")}
          />
        </div>
      </SubSection>

      <SubSection
        id="technique-sous-traitance-interne"
        title="2.3 Recours à la sous-traitance interne Akkodis"
      >
        <TextArea
          label="Sous-traitance interne"
          {...register("internal_subcontracting")}
        />
      </SubSection>

      <SubSection
        id="technique-sous-traitance-externe"
        title="2.4 Recours à la sous-traitance externe"
      >
        <StringList
          register={register}
          control={control}
          name="external_subcontractors"
          title="Sous-traitants externes"
          itemLabel="Sous-traitant"
          addLabel="+ Ajouter un sous-traitant"
        />
      </SubSection>

      <SubSection id="technique-pilotage" title="2.5 Pilotage de la prestation">
        <TextArea
          label="Pilotage de la prestation"
          {...register("service_monitoring")}
        />
      </SubSection>

      <SubSection id="technique-exigences" title="2.6 Réponse aux exigences">
        <RequirementsList register={register} control={control} />
      </SubSection>

      <SubSection id="technique-risques" title="2.7 Principaux risques">
        <RisksList register={register} control={control} />
      </SubSection>

      <SubSection id="technique-competences" title="2.8 Compétences">
        <TextArea label="Compétences" {...register("skills_description")} />
      </SubSection>
    </Section>
  );
}

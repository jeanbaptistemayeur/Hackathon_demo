"use client";

import { useWatch } from "react-hook-form";
import { Field } from "../ui/Field";
import { TextArea } from "../ui/TextArea";
import { SelectField } from "../ui/SelectField";
import { Section, SubSection } from "../ui/Section";
import { RequirementsList } from "./RequirementsList";
import { RisksList } from "./RisksList";
import { StringList } from "./StringList";
import { SkillsList } from "./SkillsList";
import {
  RISK_STATEMENT_OPTIONS,
  REQUIREMENTS_STATEMENT_OPTIONS,
} from "../../schemas/ptf-form.schema";
import type { SectionFormProps } from "./sections";

export function TechniqueSection({ register, control }: SectionFormProps) {
  const riskStatement = useWatch({ control, name: "risks_statement" });
  const requirementsStatement = useWatch({
    control,
    name: "requirements_statement",
  });

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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field
            label="Prénom du chargé d'affaire"
            {...register("client_manager_firstName")}
          />
          <Field
            label="Nom du chargé d'affaire"
            {...register("client_manager_name")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom du BM" {...register("bm_firstName")} />
          <Field label="Nom du BM" {...register("bm_name")} />
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
        <Field label="Nom du consultant" {...register("service_monitoring")} />
      </SubSection>

      <SubSection id="technique-exigences" title="2.6 Réponse aux exigences">
        <SelectField
          label="Formulation"
          options={[...REQUIREMENTS_STATEMENT_OPTIONS]}
          {...register("requirements_statement")}
        />
        {requirementsStatement === "exigences_exclues" && (
          <div className="mt-4">
            <RequirementsList register={register} control={control} />
          </div>
        )}
      </SubSection>

      <SubSection id="technique-risques" title="2.7 Principaux risques">
        <SelectField
          label="Formulation"
          options={[...RISK_STATEMENT_OPTIONS]}
          {...register("risks_statement")}
        />
        {riskStatement === "risques_identifies" && (
          <div className="mt-4">
            <RisksList register={register} control={control} />
          </div>
        )}
      </SubSection>

      <SubSection id="technique-competences" title="2.8 Compétences">
        <SkillsList register={register} control={control} />
      </SubSection>
    </Section>
  );
}

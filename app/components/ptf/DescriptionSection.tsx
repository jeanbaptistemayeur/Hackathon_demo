"use client";

import { Field } from "../ui/Field";
import { Section } from "../ui/Section";
import type { SectionFormProps } from "./sections";

export function DescriptionSection({ register }: SectionFormProps) {
  return (
    <Section id="description" title="Description">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Titre du projet" {...register("project_title")} />
        <Field label="Nature du document" {...register("document_nature")} />
        <Field
          label="Référence cahier des charges"
          {...register("spec_reference")}
        />
        <Field label="Référence de l'offre" {...register("offer_reference")} />
        <Field label="Date de l'offre" {...register("offer_date")} />
        <Field label="Date de validité" {...register("validity_date")} />
        <Field label="Validé par" {...register("validated_by")} />
        <Field label="Nom du client" {...register("client_name")} />
        <Field label="N° RCS client" {...register("client_rcs")} />
        <Field
          label="Entité Akkodis (facturation)"
          {...register("akkodis_entity")}
        />
        <Field label="Devise" {...register("currency")} />
        <Field label="Contrat Cadre" {...register("framework_contract")} />
      </div>
    </Section>
  );
}

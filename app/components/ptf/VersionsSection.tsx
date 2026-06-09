"use client";

import { Field } from "../ui/Field";
import { TextArea } from "../ui/TextArea";
import { Section } from "../ui/Section";
import type { SectionFormProps } from "./sections";

export function VersionsSection({ register }: SectionFormProps) {
  return (
    <Section id="versions" title="Suivi des versions">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Version" {...register("version")} />
        <Field label="Date de l'offre" {...register("offer_date")} />
      </div>
      <div className="mt-4">
        <TextArea
          label="Modifications / notes de version"
          {...register("version_notes")}
        />
      </div>
    </Section>
  );
}

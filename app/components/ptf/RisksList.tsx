"use client";

import { useFieldArray } from "react-hook-form";
import { Field } from "../ui/Field";
import { AddButton, RemoveButton, SubGroup } from "../ui/Section";
import type { SectionFormProps } from "./sections";

export function RisksList({ register, control }: SectionFormProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "risks" });

  return (
    <SubGroup title="Principaux risques">
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-4 gap-2 mb-2 items-end">
          <Field
            label="Nature du risque"
            {...register(`risks.${index}.risk_nature`)}
          />
          <Field
            label="Plan de mitigation"
            {...register(`risks.${index}.mitigation_plan`)}
          />
          <Field label="Commentaire" {...register(`risks.${index}.comment`)} />
          <RemoveButton onClick={() => remove(index)} />
        </div>
      ))}
      <AddButton
        onClick={() =>
          append({ risk_nature: "", mitigation_plan: "", comment: "" })
        }
      >
        + Ajouter un risque
      </AddButton>
    </SubGroup>
  );
}

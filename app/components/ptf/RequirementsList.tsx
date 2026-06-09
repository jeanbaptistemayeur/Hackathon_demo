"use client";

import { useFieldArray } from "react-hook-form";
import { Field } from "../ui/Field";
import { SelectField } from "../ui/SelectField";
import { AddButton, RemoveButton, SubGroup } from "../ui/Section";
import type { SectionFormProps } from "./sections";

const STATUS_OPTIONS = [
  { value: "C", label: "Conforme" },
  { value: "PC", label: "Partiellement Conforme" },
  { value: "NC", label: "Non Conforme" },
  { value: "NA", label: "NA" },
];

export function RequirementsList({ register, control }: SectionFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements_matrix",
  });

  return (
    <SubGroup title="Réponse aux exigences">
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-5 gap-2 mb-2 items-end">
          <Field
            label="Réf. chapitre"
            {...register(`requirements_matrix.${index}.chapter_reference`)}
          />
          <Field
            label="Nom chapitre"
            {...register(`requirements_matrix.${index}.chapter_name`)}
          />
          <SelectField
            label="Statut"
            options={STATUS_OPTIONS}
            {...register(`requirements_matrix.${index}.compliance_status`)}
          />
          <Field
            label="Commentaire"
            {...register(`requirements_matrix.${index}.comment`)}
          />
          <RemoveButton onClick={() => remove(index)} />
        </div>
      ))}
      <AddButton
        onClick={() =>
          append({
            chapter_reference: "",
            chapter_name: "",
            compliance_status: "C",
            comment: "",
          })
        }
      >
        + Ajouter une exigence
      </AddButton>
    </SubGroup>
  );
}

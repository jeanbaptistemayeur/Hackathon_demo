"use client";

import { useFieldArray } from "react-hook-form";
import { Field } from "../ui/Field";
import { SelectField } from "../ui/SelectField";
import { AddButton, RemoveButton } from "../ui/Section";
import type { SectionFormProps } from "./sections";

const RATING_OPTIONS = [
  { value: "0", label: "0 / 5" },
  { value: "1", label: "1 / 5" },
  { value: "2", label: "2 / 5" },
  { value: "3", label: "3 / 5" },
  { value: "4", label: "4 / 5" },
  { value: "5", label: "5 / 5" },
];

export function SkillsList({ register, control }: SectionFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-[1fr_auto_auto] gap-2 mb-2 items-end"
        >
          <Field
            label="Compétence"
            placeholder="Nom de la compétence"
            {...register(`skills.${index}.name`)}
          />
          <SelectField
            label="Niveau"
            options={RATING_OPTIONS}
            {...register(`skills.${index}.rating`, { valueAsNumber: true })}
          />
          <RemoveButton onClick={() => remove(index)} />
        </div>
      ))}
      <AddButton onClick={() => append({ name: "", rating: 0 })}>
        + Ajouter une compétence
      </AddButton>
    </div>
  );
}

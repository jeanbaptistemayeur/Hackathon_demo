"use client";

import { useFieldArray } from "react-hook-form";
import { Field } from "../ui/Field";
import { AddButton, RemoveButton, SubGroup } from "../ui/Section";
import type { SectionFormProps } from "./sections";

type StringArrayName =
  | "location_address"
  | "proposal_highlights"
  | "external_subcontractors";

interface StringListProps extends SectionFormProps {
  name: StringArrayName;
  title: string;
  itemLabel: string;
  addLabel: string;
}

export function StringList({
  register,
  control,
  name,
  title,
  itemLabel,
  addLabel,
}: StringListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    // RHF requires object items for useFieldArray; string arrays are addressed by index.
    name: name as never,
  });

  return (
    <SubGroup title={title}>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-6 gap-2 mb-2 items-end">
          <div className="col-span-5">
            <Field
              label={`${itemLabel} ${index + 1}`}
              {...register(`${name}.${index}`)}
            />
          </div>
          <RemoveButton onClick={() => remove(index)} />
        </div>
      ))}
      <AddButton onClick={() => append("" as never)}>{addLabel}</AddButton>
    </SubGroup>
  );
}

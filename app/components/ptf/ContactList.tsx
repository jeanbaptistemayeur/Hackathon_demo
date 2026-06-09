"use client";

import { useFieldArray } from "react-hook-form";
import { Field } from "../ui/Field";
import { AddButton, RemoveButton, SubGroup } from "../ui/Section";
import type { SectionFormProps } from "./sections";

type ContactArrayName = "client_contacts" | "akkodis_contacts";

interface ContactListProps extends SectionFormProps {
  name: ContactArrayName;
  title: string;
  addLabel: string;
}

export function ContactList({
  register,
  control,
  name,
  title,
  addLabel,
}: ContactListProps) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <SubGroup title={title}>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-5 gap-2 mb-2 items-end">
          <Field label="Prénom" {...register(`${name}.${index}.firstName`)} />
          <Field label="Nom" {...register(`${name}.${index}.lastName`)} />
          <Field label="Fonction" {...register(`${name}.${index}.function`)} />
          <Field label="Email" {...register(`${name}.${index}.email`)} />
          <RemoveButton onClick={() => remove(index)} />
        </div>
      ))}
      <AddButton
        onClick={() =>
          append({
            firstName: "",
            lastName: "",
            function: "",
            phone: "",
            email: "",
          })
        }
      >
        {addLabel}
      </AddButton>
    </SubGroup>
  );
}

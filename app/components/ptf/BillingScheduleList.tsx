"use client";

import { useFieldArray } from "react-hook-form";
import { Field } from "../ui/Field";
import { AddButton, RemoveButton } from "../ui/Section";
import type { SectionFormProps } from "./sections";

export function BillingScheduleList({ register, control }: SectionFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "billing_schedule_entries",
  });

  return (
    <div className="mt-2">
      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-2 mb-1 text-xs font-medium text-gray-500">
        <span className="w-8">N°</span>
        <span>Tranche</span>
        <span>Montant total HT (€)</span>
        <span>Échéance</span>
        <span>Montant échéance HT (€)</span>
        <span />
      </div>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-2 mb-2 items-end"
        >
          <span className="w-8 pb-2 text-sm text-gray-700">{index + 1}</span>
          <Field
            placeholder="Nom de la tranche"
            {...register(`billing_schedule_entries.${index}.tranche_name`)}
          />
          <Field
            type="number"
            placeholder="XXX"
            {...register(`billing_schedule_entries.${index}.tranche_total`, {
              valueAsNumber: true,
            })}
          />
          <Field
            placeholder="Mois 1 Année"
            {...register(`billing_schedule_entries.${index}.due_date`)}
          />
          <Field
            type="number"
            placeholder="XXX"
            {...register(`billing_schedule_entries.${index}.due_amount`, {
              valueAsNumber: true,
            })}
          />
          <RemoveButton onClick={() => remove(index)} />
        </div>
      ))}
      <AddButton
        onClick={() =>
          append({
            tranche_name: "",
            tranche_total: 0,
            due_date: "",
            due_amount: 0,
          })
        }
      >
        + Ajouter une échéance
      </AddButton>
    </div>
  );
}

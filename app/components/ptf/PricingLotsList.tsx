"use client";

import { useFieldArray } from "react-hook-form";
import { Field } from "../ui/Field";
import { AddButton, RemoveButton, SubGroup } from "../ui/Section";
import type { SectionFormProps } from "./sections";

export function PricingLotsList({ register, control }: SectionFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricing_lots",
  });

  return (
    <SubGroup title="Lots de tarification">
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-6 gap-2 mb-2 items-end">
          <Field
            label="Nom du lot"
            {...register(`pricing_lots.${index}.lot_name`)}
          />
          <Field
            label="Description"
            {...register(`pricing_lots.${index}.description`)}
          />
          <Field
            label="TJM (€)"
            type="number"
            {...register(`pricing_lots.${index}.daily_rate`, {
              valueAsNumber: true,
            })}
          />
          <Field
            label="Jours"
            type="number"
            {...register(`pricing_lots.${index}.production_days`, {
              valueAsNumber: true,
            })}
          />
          <Field
            label="Prix lot (€)"
            type="number"
            {...register(`pricing_lots.${index}.lot_price`, {
              valueAsNumber: true,
            })}
          />
          <RemoveButton onClick={() => remove(index)} />
        </div>
      ))}
      <AddButton
        onClick={() =>
          append({
            lot_name: "",
            description: "",
            nf_code: "",
            daily_rate: 0,
            production_days: 0,
            unit_count: 0,
            lot_price: 0,
            contract_type: "",
          })
        }
      >
        + Ajouter un lot
      </AddButton>
    </SubGroup>
  );
}

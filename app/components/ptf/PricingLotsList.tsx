"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Field } from "../ui/Field";
import { AddButton, RemoveButton, SubGroup } from "../ui/Section";
import { CalculatorModal } from "../calculator/CalculatorModal";
import type { CalculatorInput, CalculatorResult } from "../../lib/calculator";
import type { PtfFormData } from "../../schemas/ptf-form.schema";
import type { SectionFormProps } from "./sections";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const round2 = (value: number) => Math.round(value * 100) / 100;

export function PricingLotsList({ register, control }: SectionFormProps) {
  const { getValues, setValue } = useFormContext<PtfFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricing_lots",
  });

  const getInitialValues = (): Partial<CalculatorInput> => {
    const start = getValues("mission_start_date");
    const end = getValues("mission_end_date");
    const firstLotRate = getValues("pricing_lots")?.[0]?.daily_rate;
    return {
      firstName: getValues("candidate_firstName") || "",
      lastName: getValues("candidate_lastName") || "",
      ...(ISO_DATE.test(start ?? "") ? { startDate: start } : {}),
      ...(ISO_DATE.test(end ?? "") ? { endDate: end } : {}),
      ...(firstLotRate ? { tjmInput: firstLotRate } : {}),
    };
  };

  const handleApply = (result: CalculatorResult, input: CalculatorInput) => {
    const dailyRate = round2(result.tjm);
    const productionDays = round2(result.billableDays);
    const lotPrice = round2(result.tjm * result.billableDays);

    const candidateName = `${input.firstName} ${input.lastName}`.trim();
    const projectTitle = getValues("project_title")?.trim();
    const lotName = candidateName
      ? projectTitle || candidateName
      : "Lot calculé";

    append({
      lot_name: lotName,
      description: "",
      nf_code: input.serviceCode || "",
      daily_rate: dailyRate,
      production_days: productionDays,
      unit_count: 0,
      lot_price: lotPrice,
      contract_type: "",
    });

    const existing = getValues("pricing_lots") ?? [];
    const totalPrice = existing.reduce((sum, lot) => sum + (lot.lot_price || 0), 0) + lotPrice;
    const totalDays =
      existing.reduce((sum, lot) => sum + (lot.production_days || 0), 0) + productionDays;
    setValue("total_price_ht", round2(totalPrice), { shouldDirty: true });
    setValue("total_production_days", round2(totalDays), { shouldDirty: true });
  };

  return (
    <SubGroup title="Lots de tarification">
      <div className="mb-3">
        <CalculatorModal getInitialValues={getInitialValues} onApply={handleApply} />
      </div>
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

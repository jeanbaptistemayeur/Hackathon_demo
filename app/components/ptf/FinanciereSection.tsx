"use client";

import { useWatch } from "react-hook-form";
import { Field } from "../ui/Field";
import { SelectField } from "../ui/SelectField";
import { Section, SubSection } from "../ui/Section";
import { PricingLotsList } from "./PricingLotsList";
import { BillingScheduleList } from "./BillingScheduleList";
import {
  BILLING_FREQUENCY_OPTIONS,
  EXPENSES_POLICY_OPTIONS,
} from "../../schemas/ptf-form.schema";
import type { SectionFormProps } from "./sections";

export function FinanciereSection({ register, control }: SectionFormProps) {
  const billingFrequency = useWatch({ control, name: "billing_frequency" });

  return (
    <Section id="financiere" title="3 Proposition financière">
      <SubSection id="financiere-prix" title="3.1 Prix">
        <PricingLotsList register={register} control={control} />
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Field
            label="Remise commerciale (%)"
            type="number"
            {...register("commercial_discount_percent", {
              valueAsNumber: true,
            })}
          />
          <Field
            label="Total HT (€)"
            type="number"
            {...register("total_price_ht", { valueAsNumber: true })}
          />
          <Field
            label="Jours de production totaux"
            type="number"
            {...register("total_production_days", { valueAsNumber: true })}
          />
        </div>
      </SubSection>

      <SubSection id="financiere-frais" title="3.2 Frais">
        <SelectField
          label="Politique de frais"
          options={[
            { value: "", label: "— Sélectionner —" },
            ...EXPENSES_POLICY_OPTIONS,
          ]}
          {...register("expenses_policy")}
        />
      </SubSection>

      <SubSection id="financiere-facturation" title="3.3 Facturation">
        <SelectField
          label="Fréquence de facturation"
          options={[
            { value: "", label: "— Sélectionner —" },
            ...BILLING_FREQUENCY_OPTIONS,
          ]}
          {...register("billing_frequency")}
        />
        {billingFrequency === "echeancier" && (
          <BillingScheduleList register={register} control={control} />
        )}
      </SubSection>
    </Section>
  );
}

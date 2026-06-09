"use client";

import { Field } from "../ui/Field";
import { TextArea } from "../ui/TextArea";
import { Section, SubSection } from "../ui/Section";
import { PricingLotsList } from "./PricingLotsList";
import type { SectionFormProps } from "./sections";

export function FinanciereSection({ register, control }: SectionFormProps) {
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
        <h4 className="text-xs font-medium text-gray-500 mb-2">
          Frais annexes
        </h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field
            label="Détail frais"
            {...register("ancillary_expenses.details")}
          />
          <Field
            label="Forfait jour (€)"
            type="number"
            {...register("ancillary_expenses.daily_fee", {
              valueAsNumber: true,
            })}
          />
          <Field
            label="Nb jours"
            type="number"
            {...register("ancillary_expenses.days", { valueAsNumber: true })}
          />
          <Field
            label="Total (€)"
            type="number"
            {...register("ancillary_expenses.total", { valueAsNumber: true })}
          />
        </div>
        <h4 className="text-xs font-medium text-gray-500 mb-2">Licences</h4>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Détail licences"
            {...register("license_fees.details")}
          />
          <Field
            label="Forfait jour (€)"
            type="number"
            {...register("license_fees.daily_fee", { valueAsNumber: true })}
          />
          <Field
            label="Jours d'utilisation"
            type="number"
            {...register("license_fees.usage_days", { valueAsNumber: true })}
          />
          <Field
            label="Total (€)"
            type="number"
            {...register("license_fees.total", { valueAsNumber: true })}
          />
        </div>
      </SubSection>

      <SubSection id="financiere-facturation" title="3.3 Facturation">
        <div className="mb-4">
          <Field
            label="Fréquence de facturation"
            {...register("billing_frequency")}
          />
        </div>
        <TextArea
          label="Échéancier de facturation"
          {...register("billing_schedule")}
        />
      </SubSection>

      <SubSection id="financiere-calendrier" title="3.4 Calendrier de paiement">
        <div className="mb-4">
          <Field
            label="Conditions de paiement"
            {...register("payment_terms")}
          />
        </div>
        <TextArea
          label="Calendrier de paiement"
          {...register("payment_schedule")}
        />
      </SubSection>

      <SubSection id="financiere-commandes" title="3.5 Gestion des commandes">
        <div className="mb-4">
          <Field label="Email commandes" {...register("order_email")} />
        </div>
        <TextArea
          label="Gestion des commandes"
          {...register("order_management")}
        />
      </SubSection>

      <SubSection id="financiere-cgv" title="3.6 CGV">
        <TextArea
          label="Conditions Générales de Vente"
          {...register("cgv_terms")}
        />
      </SubSection>

      <SubSection
        id="financiere-revision"
        title="3.7 Révision des taux journaliers et des tarifs"
      >
        <TextArea
          label="Formule de révision"
          {...register("rate_revision_formula")}
        />
      </SubSection>

      <SubSection id="financiere-signature" title="3.8 Signature">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Signataire client"
            {...register("client_signatory_name")}
          />
          <Field
            label="Fonction signataire client"
            {...register("client_signatory_function")}
          />
          <Field
            label="Signataire Akkodis"
            {...register("akkodis_signatory_name")}
          />
          <Field
            label="Fonction signataire Akkodis"
            {...register("akkodis_signatory_function")}
          />
        </div>
      </SubSection>

      <SubSection
        id="financiere-annexe-env"
        title="Annexe 1 · Politique environnement"
      >
        <TextArea
          label="Politique environnement"
          {...register("environment_policy_annex")}
        />
      </SubSection>
    </Section>
  );
}

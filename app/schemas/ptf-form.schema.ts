import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().optional().default(""),
  lastName: z.string().optional().default(""),
  function: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
});

const requirementSchema = z.object({
  chapter_reference: z.string().optional().default(""),
  chapter_name: z.string().optional().default(""),
  compliance_status: z.enum(["C", "PC", "NC", "NA"]).optional().default("C"),
  comment: z.string().optional().default(""),
});

const riskSchema = z.object({
  risk_nature: z.string().optional().default(""),
  mitigation_plan: z.string().optional().default(""),
  comment: z.string().optional().default(""),
});

const pricingLotSchema = z.object({
  lot_name: z.string().optional().default(""),
  description: z.string().optional().default(""),
  nf_code: z.string().optional().default(""),
  daily_rate: z.number().optional().default(0),
  production_days: z.number().optional().default(0),
  unit_count: z.number().optional().default(0),
  lot_price: z.number().optional().default(0),
  contract_type: z.string().optional().default(""),
});

export const ptfFormSchema = z.object({
  // Specifications
  project_title: z.string().optional().default(""),
  client_name: z.string().optional().default(""),
  client_rcs: z.string().optional().default(""),
  spec_reference: z.string().optional().default(""),
  document_nature: z.string().optional().default(""),
  offer_reference: z.string().optional().default(""),
  offer_date: z.string().optional().default(""),
  mission_start_date: z.string().optional().default(""),
  mission_end_date: z.string().optional().default(""),
  validity_date: z.string().optional().default(""),
  validated_by: z.string().optional().default(""),
  akkodis_entity: z.string().optional().default(""),
  currency: z.string().optional().default(""),
  framework_contract: z.string().optional().default(""),
  client_contacts: z.array(contactSchema).optional().default([]),
  akkodis_contacts: z.array(contactSchema).optional().default([]),
  business_segment: z.string().optional().default(""),
  nf_code: z.string().optional().default(""),
  context_overview: z.string().optional().default(""),
  main_mission: z.string().optional().default(""),
  location: z.string().optional().default(""),
  location_address: z.array(z.string()).optional().default([]),
  service_window: z.string().optional().default(""),
  logistics_provider: z.string().optional().default(""),
  ppe_required: z.boolean().optional().default(false),
  ppe_details: z.string().optional().default(""),
  clearance_required: z.boolean().optional().default(false),
  clearance_details: z.string().optional().default(""),
  export_control: z.boolean().optional().default(false),
  gdpr_applicable: z.boolean().optional().default(false),
  ai_usage: z.string().optional().default(""),
  fte_count: z.number().optional().default(0),
  carbon_impact: z.string().optional().default(""),
  requirements_matrix: z.array(requirementSchema).optional().default([]),
  risks: z.array(riskSchema).optional().default([]),
  pricing_lots: z.array(pricingLotSchema).optional().default([]),
  commercial_discount_percent: z.number().optional().default(0),
  total_price_ht: z.number().optional().default(0),
  total_production_days: z.number().optional().default(0),
  ancillary_expenses: z
    .object({
      details: z.string().optional().default(""),
      daily_fee: z.number().optional().default(0),
      days: z.number().optional().default(0),
      total: z.number().optional().default(0),
    })
    .optional()
    .default(() => ({ details: "", daily_fee: 0, days: 0, total: 0 })),
  license_fees: z
    .object({
      details: z.string().optional().default(""),
      daily_fee: z.number().optional().default(0),
      usage_days: z.number().optional().default(0),
      total: z.number().optional().default(0),
    })
    .optional()
    .default(() => ({ details: "", daily_fee: 0, usage_days: 0, total: 0 })),
  billing_frequency: z.string().optional().default(""),
  payment_terms: z.string().optional().default(""),
  order_email: z.string().optional().default(""),
  rate_revision_formula: z.string().optional().default(""),
  client_signatory_name: z.string().optional().default(""),
  client_signatory_function: z.string().optional().default(""),
  akkodis_signatory_name: z.string().optional().default(""),
  akkodis_signatory_function: z.string().optional().default(""),
  version: z.string().optional().default("1.0"),
  version_notes: z.string().optional().default(""),

  // Narrative / editable text sections
  applicable_documents: z.string().optional().default(""),
  prevention_measures: z.string().optional().default(""),
  ges_method: z.string().optional().default(""),
  carbon_cost_note: z.string().optional().default(""),
  env_management: z.string().optional().default(""),
  internal_subcontracting: z.string().optional().default(""),
  service_monitoring: z.string().optional().default(""),
  skills_description: z.string().optional().default(""),
  billing_schedule: z.string().optional().default(""),
  payment_schedule: z.string().optional().default(""),
  order_management: z.string().optional().default(""),
  cgv_terms: z.string().optional().default(""),
  environment_policy_annex: z.string().optional().default(""),

  // Profiles
  candidate_firstName: z.string().optional().default(""),
  candidate_lastName: z.string().optional().default(""),
  candidate_function: z.string().optional().default(""),
  proposal_highlights: z.array(z.string()).optional().default([]),
  client_manager_name: z.string().optional().default(""),
  team_manager_name: z.string().optional().default(""),
  team_manager_function: z.string().optional().default(""),
  external_subcontractors: z.array(z.string()).optional().default([]),
});

export type PtfFormData = z.infer<typeof ptfFormSchema>;

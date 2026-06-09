"use client";

import { DescriptionSection } from "./ptf/DescriptionSection";
import { VersionsSection } from "./ptf/VersionsSection";
import { EnjeuxSection } from "./ptf/EnjeuxSection";
import { TechniqueSection } from "./ptf/TechniqueSection";
import { FinanciereSection } from "./ptf/FinanciereSection";
import type { SectionFormProps } from "./ptf/sections";

export { PTF_SECTIONS } from "./ptf/sections";

export function PtfForm({ register, control }: SectionFormProps) {
  return (
    <div className="space-y-6">
      <DescriptionSection register={register} control={control} />
      <VersionsSection register={register} control={control} />
      <EnjeuxSection register={register} control={control} />
      <TechniqueSection register={register} control={control} />
      <FinanciereSection register={register} control={control} />
    </div>
  );
}

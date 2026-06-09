import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ACCEPTED_SPEC_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_PROFILE_TYPES = ["application/json"];

export const analyzeSpecSchema = z.object({
  specFile: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "A specification file is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "File size must be less than 10MB."
    )
    .refine(
      (files) => ACCEPTED_SPEC_TYPES.includes(files?.[0]?.type),
      "Only .docx and .pdf files are accepted."
    ),
  profileFile: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "A profile file is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "File size must be less than 10MB."
    )
    .refine(
      (files) => ACCEPTED_PROFILE_TYPES.includes(files?.[0]?.type),
      "Only .json files are accepted."
    ),
});

export type AnalyzeSpecFormData = z.infer<typeof analyzeSpecSchema>;

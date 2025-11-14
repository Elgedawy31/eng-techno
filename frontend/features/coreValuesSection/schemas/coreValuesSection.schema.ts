import { z } from "zod";

export const createOrUpdateCoreValuesSectionSchema = z.object({
  label: z
    .string()
    .max(200, "Label must be less than 200 characters")
    .optional(),
  heading: z
    .string()
    .min(1, "Heading is required")
    .max(1000, "Heading must be less than 1000 characters"),
  isActive: z.boolean().default(true),
});

export const updateCoreValuesSectionSchema = z.object({
  label: z
    .string()
    .max(200, "Label must be less than 200 characters")
    .optional(),
  heading: z
    .string()
    .min(1, "Heading is required")
    .max(1000, "Heading must be less than 1000 characters")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateOrUpdateCoreValuesSectionFormData = z.infer<typeof createOrUpdateCoreValuesSectionSchema>;
export type UpdateCoreValuesSectionFormData = z.infer<typeof updateCoreValuesSectionSchema>;


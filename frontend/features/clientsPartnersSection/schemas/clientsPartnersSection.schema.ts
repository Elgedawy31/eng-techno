import { z } from "zod";

export const createOrUpdateClientsPartnersSectionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  isActive: z.boolean().default(true),
});

export const updateClientsPartnersSectionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateOrUpdateClientsPartnersSectionFormData = z.infer<typeof createOrUpdateClientsPartnersSectionSchema>;
export type UpdateClientsPartnersSectionFormData = z.infer<typeof updateClientsPartnersSectionSchema>;


import { z } from "zod";

export const createOrUpdateMediaCentreSchema = z.object({
  mainTitle: z
    .string()
    .min(1, "Main title is required")
    .max(200, "Main title must be less than 200 characters"),
  mainDescription: z
    .string()
    .min(1, "Main description is required")
    .max(2000, "Main description must be less than 2000 characters"),
  isActive: z.boolean().default(true),
});

export const updateMediaCentreSchema = z.object({
  mainTitle: z
    .string()
    .min(1, "Main title is required")
    .max(200, "Main title must be less than 200 characters")
    .optional(),
  mainDescription: z
    .string()
    .min(1, "Main description is required")
    .max(2000, "Main description must be less than 2000 characters")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateOrUpdateMediaCentreFormData = z.infer<typeof createOrUpdateMediaCentreSchema>;
export type UpdateMediaCentreFormData = z.infer<typeof updateMediaCentreSchema>;


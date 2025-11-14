import { z } from "zod";

export const createCoreValueSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  order: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().default(true),
});

export const updateCoreValueSchema = z.object({
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
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type CreateCoreValueFormData = z.infer<typeof createCoreValueSchema>;
export type UpdateCoreValueFormData = z.infer<typeof updateCoreValueSchema>;


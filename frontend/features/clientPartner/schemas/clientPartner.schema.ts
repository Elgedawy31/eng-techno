import { z } from "zod";

export const createClientPartnerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(300, "Name must be less than 300 characters"),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  order: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().default(true),
  emblemImage: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Image size must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Image must be JPEG, PNG, or WebP"
    )
    .optional(),
});

export const updateClientPartnerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(300, "Name must be less than 300 characters")
    .optional(),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  emblemImage: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Image size must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Image must be JPEG, PNG, or WebP"
    )
    .optional(),
}).refine(
  (data) => {
    if (data.emblemImage !== undefined && data.emblemImage !== null) {
      return data.emblemImage instanceof File;
    }
    return true;
  },
  { message: "Invalid file", path: ["emblemImage"] }
);

export type CreateClientPartnerFormData = z.infer<typeof createClientPartnerSchema>;
export type UpdateClientPartnerFormData = z.infer<typeof updateClientPartnerSchema>;


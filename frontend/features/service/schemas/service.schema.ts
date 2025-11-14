import { z } from "zod";

export const createServiceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  categoryTags: z
    .array(z.string())
    .max(10, "Cannot have more than 10 category tags")
    .optional()
    .default([]),
  buttonText: z
    .string()
    .min(1, "Button text is required")
    .max(100, "Button text must be less than 100 characters")
    .default("EXPLORE"),
  buttonAction: z
    .string()
    .min(1, "Button action is required")
    .max(500, "Button action must be less than 500 characters"),
  additionalText: z
    .string()
    .max(2000, "Additional text must be less than 2000 characters")
    .optional(),
  order: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().default(true),
  backgroundImage: z
    .instanceof(File, { message: "Background image is required" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "Image size must be less than 10MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Image must be JPEG, PNG, or WebP"
    ),
});

export const updateServiceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
    .optional(),
  categoryTags: z
    .array(z.string())
    .max(10, "Cannot have more than 10 category tags")
    .optional(),
  buttonText: z
    .string()
    .min(1, "Button text is required")
    .max(100, "Button text must be less than 100 characters")
    .optional(),
  buttonAction: z
    .string()
    .min(1, "Button action is required")
    .max(500, "Button action must be less than 500 characters")
    .optional(),
  additionalText: z
    .string()
    .max(2000, "Additional text must be less than 2000 characters")
    .optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  backgroundImage: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "Image size must be less than 10MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Image must be JPEG, PNG, or WebP"
    )
    .optional(),
}).refine(
  (data) => {
    // If backgroundImage is provided, it must be a valid File
    if (data.backgroundImage !== undefined && data.backgroundImage !== null) {
      return data.backgroundImage instanceof File;
    }
    return true;
  },
  {
    message: "Invalid file",
    path: ["backgroundImage"],
  }
);

export type CreateServiceFormData = z.infer<typeof createServiceSchema>;
export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;


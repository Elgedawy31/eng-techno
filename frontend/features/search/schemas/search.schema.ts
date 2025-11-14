import { z } from "zod";

export const createOrUpdateSearchSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(500, "Subtitle must be less than 500 characters"),
  placeholder: z
    .string()
    .min(1, "Placeholder is required")
    .max(300, "Placeholder must be less than 300 characters"),
  buttonText: z
    .string()
    .min(1, "Button text is required")
    .max(100, "Button text must be less than 100 characters")
    .default("SEARCH"),
  isActive: z.boolean().default(true),
  logoImage: z
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

export const updateSearchSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(500, "Subtitle must be less than 500 characters")
    .optional(),
  placeholder: z
    .string()
    .min(1, "Placeholder is required")
    .max(300, "Placeholder must be less than 300 characters")
    .optional(),
  buttonText: z
    .string()
    .min(1, "Button text is required")
    .max(100, "Button text must be less than 100 characters")
    .optional(),
  isActive: z.boolean().optional(),
  logoImage: z
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
    // If logoImage is provided, it must be a valid File
    if (data.logoImage !== undefined && data.logoImage !== null) {
      return data.logoImage instanceof File;
    }
    return true;
  },
  {
    message: "Invalid file",
    path: ["logoImage"],
  }
);

export type CreateOrUpdateSearchFormData = z.infer<typeof createOrUpdateSearchSchema>;
export type UpdateSearchFormData = z.infer<typeof updateSearchSchema>;


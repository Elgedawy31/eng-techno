import { z } from "zod";

export const createOrUpdateAboutPageHeroSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title must be less than 500 characters"),
  isActive: z.boolean().default(true),
  backgroundImage: z
    .instanceof(File, { message: "Background image is required" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Image size must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Image must be JPEG, PNG, or WebP"
    ),
});

export const updateAboutPageHeroSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title must be less than 500 characters")
    .optional(),
  isActive: z.boolean().optional(),
  backgroundImage: z
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

export type CreateOrUpdateAboutPageHeroFormData = z.infer<typeof createOrUpdateAboutPageHeroSchema>;
export type UpdateAboutPageHeroFormData = z.infer<typeof updateAboutPageHeroSchema>;


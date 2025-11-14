import { z } from "zod";

export const createOrUpdateHeroSchema = z.object({
  headline: z
    .string()
    .min(1, "Headline is required")
    .max(500, "Headline must be less than 500 characters"),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(1000, "Subtitle must be less than 1000 characters"),
  buttonText: z
    .string()
    .min(1, "Button text is required")
    .max(100, "Button text must be less than 100 characters")
    .default("EXPLORE"),
  buttonAction: z
    .string()
    .min(1, "Button action is required")
    .max(500, "Button action must be less than 500 characters"),
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

export const updateHeroSchema = z.object({
  headline: z
    .string()
    .min(1, "Headline is required")
    .max(500, "Headline must be less than 500 characters")
    .optional(),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(1000, "Subtitle must be less than 1000 characters")
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

export type CreateOrUpdateHeroFormData = z.infer<typeof createOrUpdateHeroSchema>;
export type UpdateHeroFormData = z.infer<typeof updateHeroSchema>;


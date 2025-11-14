import { z } from "zod";

export const createOrUpdateAboutPageContentSchema = z.object({
  headline: z
    .string()
    .min(1, "Headline is required")
    .max(500, "Headline must be less than 500 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  secondDescription: z
    .string()
    .min(1, "Second description is required")
    .max(2000, "Second description must be less than 2000 characters"),
  buttonText: z
    .string()
    .min(1, "Button text is required")
    .max(100, "Button text must be less than 100 characters")
    .default("DOWNLOAD COMPANY PROFILE"),
  buttonAction: z
    .string()
    .max(500, "Button action must be less than 500 characters")
    .optional(),
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
  companyProfileFile: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB"
    )
    .refine(
      (file) => file.type === "application/pdf",
      "File must be a PDF"
    )
    .optional(),
});

export const updateAboutPageContentSchema = z.object({
  headline: z
    .string()
    .min(1, "Headline is required")
    .max(500, "Headline must be less than 500 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  secondDescription: z
    .string()
    .min(1, "Second description is required")
    .max(2000, "Second description must be less than 2000 characters")
    .optional(),
  buttonText: z
    .string()
    .min(1, "Button text is required")
    .max(100, "Button text must be less than 100 characters")
    .optional(),
  buttonAction: z
    .string()
    .max(500, "Button action must be less than 500 characters")
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
  companyProfileFile: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB"
    )
    .refine(
      (file) => file.type === "application/pdf",
      "File must be a PDF"
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
).refine(
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
).refine(
  (data) => {
    // If companyProfileFile is provided, it must be a valid File
    if (data.companyProfileFile !== undefined && data.companyProfileFile !== null) {
      return data.companyProfileFile instanceof File;
    }
    return true;
  },
  {
    message: "Invalid file",
    path: ["companyProfileFile"],
  }
);

export type CreateOrUpdateAboutPageContentFormData = z.infer<typeof createOrUpdateAboutPageContentSchema>;
export type UpdateAboutPageContentFormData = z.infer<typeof updateAboutPageContentSchema>;


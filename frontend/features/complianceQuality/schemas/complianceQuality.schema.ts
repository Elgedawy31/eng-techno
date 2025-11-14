import { z } from "zod";

export const createOrUpdateComplianceQualitySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title must be less than 500 characters"),
  firstDescription: z
    .string()
    .min(1, "First description is required")
    .max(2000, "First description must be less than 2000 characters"),
  secondDescription: z
    .string()
    .min(1, "Second description is required")
    .max(2000, "Second description must be less than 2000 characters"),
  buttonText: z
    .string()
    .min(1, "Button text is required")
    .max(100, "Button text must be less than 100 characters"),
  buttonAction: z
    .string()
    .max(500, "Button action must be less than 500 characters")
    .optional(),
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
  displayImage: z
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

export const updateComplianceQualitySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title must be less than 500 characters")
    .optional(),
  firstDescription: z
    .string()
    .min(1, "First description is required")
    .max(2000, "First description must be less than 2000 characters")
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
  displayImage: z
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

export type CreateOrUpdateComplianceQualityFormData = z.infer<typeof createOrUpdateComplianceQualitySchema>;
export type UpdateComplianceQualityFormData = z.infer<typeof updateComplianceQualitySchema>;


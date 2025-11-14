import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title must be less than 300 characters"),
  tagline: z
    .string()
    .max(200, "Tagline must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  eventDateText: z
    .string()
    .max(100, "Event date text must be less than 100 characters")
    .optional(),
  boothInfo: z
    .string()
    .max(200, "Booth info must be less than 200 characters")
    .optional(),
  isActive: z.boolean().default(true),
  eventLogoImage: z
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
});

export const updateAnnouncementSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title must be less than 300 characters")
    .optional(),
  tagline: z
    .string()
    .max(200, "Tagline must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  eventDateText: z
    .string()
    .max(100, "Event date text must be less than 100 characters")
    .optional(),
  boothInfo: z
    .string()
    .max(200, "Booth info must be less than 200 characters")
    .optional(),
  isActive: z.boolean().optional(),
  eventLogoImage: z
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
    // If eventLogoImage is provided, it must be a valid File
    if (data.eventLogoImage !== undefined && data.eventLogoImage !== null) {
      return data.eventLogoImage instanceof File;
    }
    return true;
  },
  {
    message: "Invalid file",
    path: ["eventLogoImage"],
  }
);

export type CreateAnnouncementFormData = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementFormData = z.infer<typeof updateAnnouncementSchema>;


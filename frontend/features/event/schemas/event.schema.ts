import { z } from "zod";

export const createEventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title must be less than 300 characters"),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(500, "Short description must be less than 500 characters"),
  eventDateText: z
    .string()
    .max(100, "Event date text must be less than 100 characters")
    .optional(),
  detailsButtonText: z
    .string()
    .min(1, "Details button text is required")
    .max(100, "Details button text must be less than 100 characters")
    .default("VIEW FULL EVENT DETAILS"),
  detailsButtonAction: z
    .string()
    .min(1, "Details button action is required")
    .max(500, "Details button action must be less than 500 characters"),
  displayImages: z
    .array(z.string())
    .max(10, "Cannot have more than 10 display images")
    .optional()
    .default([]),
  order: z.number().int().min(0).optional().default(0),
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
  displayImagesFiles: z
    .array(
      z.instanceof(File, { message: "Invalid file" })
        .refine(
          (file) => file.size <= 10 * 1024 * 1024,
          "Image size must be less than 10MB"
        )
        .refine(
          (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
          "Image must be JPEG, PNG, or WebP"
        )
    )
    .max(10, "Cannot have more than 10 display images")
    .optional()
    .default([]),
});

export const updateEventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title must be less than 300 characters")
    .optional(),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(500, "Short description must be less than 500 characters")
    .optional(),
  eventDateText: z
    .string()
    .max(100, "Event date text must be less than 100 characters")
    .optional(),
  detailsButtonText: z
    .string()
    .min(1, "Details button text is required")
    .max(100, "Details button text must be less than 100 characters")
    .optional(),
  detailsButtonAction: z
    .string()
    .min(1, "Details button action is required")
    .max(500, "Details button action must be less than 500 characters")
    .optional(),
  displayImages: z
    .array(z.string())
    .max(10, "Cannot have more than 10 display images")
    .optional(),
  order: z.number().int().min(0).optional(),
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
  displayImagesFiles: z
    .array(
      z.instanceof(File, { message: "Invalid file" })
        .refine(
          (file) => file.size <= 10 * 1024 * 1024,
          "Image size must be less than 10MB"
        )
        .refine(
          (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
          "Image must be JPEG, PNG, or WebP"
        )
    )
    .max(10, "Cannot have more than 10 display images")
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

export type CreateEventFormData = z.infer<typeof createEventSchema>;
export type UpdateEventFormData = z.infer<typeof updateEventSchema>;


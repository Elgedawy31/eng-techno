import { z } from "zod";

export const createOrUpdateMissionVisionSchema = z.object({
  missionTitle: z
    .string()
    .min(1, "Mission title is required")
    .max(200, "Mission title must be less than 200 characters"),
  missionDescription: z
    .string()
    .min(1, "Mission description is required")
    .max(2000, "Mission description must be less than 2000 characters"),
  visionTitle: z
    .string()
    .min(1, "Vision title is required")
    .max(200, "Vision title must be less than 200 characters"),
  visionDescription: z
    .string()
    .min(1, "Vision description is required")
    .max(2000, "Vision description must be less than 2000 characters"),
  isActive: z.boolean().default(true),
  missionLogoImage: z
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
  missionImage: z
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
  visionLogoImage: z
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
  visionImage: z
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

export const updateMissionVisionSchema = z.object({
  missionTitle: z
    .string()
    .min(1, "Mission title is required")
    .max(200, "Mission title must be less than 200 characters")
    .optional(),
  missionDescription: z
    .string()
    .min(1, "Mission description is required")
    .max(2000, "Mission description must be less than 2000 characters")
    .optional(),
  visionTitle: z
    .string()
    .min(1, "Vision title is required")
    .max(200, "Vision title must be less than 200 characters")
    .optional(),
  visionDescription: z
    .string()
    .min(1, "Vision description is required")
    .max(2000, "Vision description must be less than 2000 characters")
    .optional(),
  isActive: z.boolean().optional(),
  missionLogoImage: z
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
  missionImage: z
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
  visionLogoImage: z
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
  visionImage: z
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
    if (data.missionLogoImage !== undefined && data.missionLogoImage !== null) {
      return data.missionLogoImage instanceof File;
    }
    return true;
  },
  { message: "Invalid file", path: ["missionLogoImage"] }
).refine(
  (data) => {
    if (data.missionImage !== undefined && data.missionImage !== null) {
      return data.missionImage instanceof File;
    }
    return true;
  },
  { message: "Invalid file", path: ["missionImage"] }
).refine(
  (data) => {
    if (data.visionLogoImage !== undefined && data.visionLogoImage !== null) {
      return data.visionLogoImage instanceof File;
    }
    return true;
  },
  { message: "Invalid file", path: ["visionLogoImage"] }
).refine(
  (data) => {
    if (data.visionImage !== undefined && data.visionImage !== null) {
      return data.visionImage instanceof File;
    }
    return true;
  },
  { message: "Invalid file", path: ["visionImage"] }
);

export type CreateOrUpdateMissionVisionFormData = z.infer<typeof createOrUpdateMissionVisionSchema>;
export type UpdateMissionVisionFormData = z.infer<typeof updateMissionVisionSchema>;


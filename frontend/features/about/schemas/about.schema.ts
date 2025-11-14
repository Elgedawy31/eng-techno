import { z } from "zod";

export const createOrUpdateAboutSchema = z.object({
  label: z
    .string()
    .max(200, "Label must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be less than 5000 characters"),
  button1Text: z
    .string()
    .min(1, "Button 1 text is required")
    .max(100, "Button 1 text must be less than 100 characters")
    .default("EXPLORE"),
  button1Action: z
    .string()
    .min(1, "Button 1 action is required")
    .max(500, "Button 1 action must be less than 500 characters"),
  button2Text: z
    .string()
    .min(1, "Button 2 text is required")
    .max(100, "Button 2 text must be less than 100 characters")
    .default("DOWNLOAD COMPANY PROFILE"),
  button2Action: z
    .string()
    .max(500, "Button 2 action must be less than 500 characters")
    .optional(),
  isActive: z.boolean().default(true),
  companyProfileFile: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB"
    )
    .optional(),
});

export const updateAboutSchema = z.object({
  label: z
    .string()
    .max(200, "Label must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be less than 5000 characters")
    .optional(),
  button1Text: z
    .string()
    .min(1, "Button 1 text is required")
    .max(100, "Button 1 text must be less than 100 characters")
    .optional(),
  button1Action: z
    .string()
    .min(1, "Button 1 action is required")
    .max(500, "Button 1 action must be less than 500 characters")
    .optional(),
  button2Text: z
    .string()
    .min(1, "Button 2 text is required")
    .max(100, "Button 2 text must be less than 100 characters")
    .optional(),
  button2Action: z
    .string()
    .max(500, "Button 2 action must be less than 500 characters")
    .optional(),
  isActive: z.boolean().optional(),
  companyProfileFile: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB"
    )
    .optional(),
}).refine(
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

export type CreateOrUpdateAboutFormData = z.infer<typeof createOrUpdateAboutSchema>;
export type UpdateAboutFormData = z.infer<typeof updateAboutSchema>;


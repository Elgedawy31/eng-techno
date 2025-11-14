import { z } from "zod";

export const createOrUpdateFooterSchema = z.object({
  mainTitle: z
    .string()
    .min(1, "Main title is required")
    .max(200, "Main title must be less than 200 characters")
    .default("Contact"),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(500, "Subtitle must be less than 500 characters")
    .default("LET'S SHAPE THE FUTURE OF DEFENSE TOGETHER."),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(200, "Email must be less than 200 characters")
    .toLowerCase(),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(50, "Phone must be less than 50 characters"),
  officeLocations: z
    .string()
    .min(1, "Office locations is required")
    .max(500, "Office locations must be less than 500 characters"),
  buttonText: z
    .string()
    .min(1, "Button text is required")
    .max(100, "Button text must be less than 100 characters")
    .default("GET IN TOUCH"),
  buttonAction: z
    .string()
    .max(500, "Button action must be less than 500 characters")
    .optional(),
  isActive: z.boolean().default(true),
});

export const updateFooterSchema = z.object({
  mainTitle: z
    .string()
    .min(1, "Main title is required")
    .max(200, "Main title must be less than 200 characters")
    .optional(),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(500, "Subtitle must be less than 500 characters")
    .optional(),
  email: z
    .string()
    .email("Invalid email format")
    .max(200, "Email must be less than 200 characters")
    .toLowerCase()
    .optional(),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(50, "Phone must be less than 50 characters")
    .optional(),
  officeLocations: z
    .string()
    .min(1, "Office locations is required")
    .max(500, "Office locations must be less than 500 characters")
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
});

export type CreateOrUpdateFooterFormData = z.infer<typeof createOrUpdateFooterSchema>;
export type UpdateFooterFormData = z.infer<typeof updateFooterSchema>;


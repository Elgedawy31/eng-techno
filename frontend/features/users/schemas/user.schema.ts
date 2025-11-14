import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(500, "Name must be less than 500 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(500, "Email must be less than 500 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password must be less than 255 characters")
    .optional(),
  role: z
    .enum(["admin"], {
      message: "Invalid role",
    })
    .default("admin"),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(500, "Name must be less than 500 characters")
    .optional(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(500, "Email must be less than 500 characters")
    .optional(),
  password: z
    .string()
    .max(255, "Password must be less than 255 characters")
    .refine(
      (val) => {
        // If password is empty or undefined, it's valid (optional in edit mode)
        if (!val || val.trim() === "") return true;
        // If password is provided, it must be at least 6 characters
        return val.length >= 6;
      },
      {
        message: "Password must be at least 6 characters",
      }
    )
    .optional(),
  role: z
    .enum(["admin"], {
      message: "Invalid role",
    })
    .optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;


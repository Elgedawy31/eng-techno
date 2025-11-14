import { z } from "zod";

export const BRANCHES = ["riyadh", "jeddah", "dammam"] as const;
export type Branch = typeof BRANCHES[number];

const baseUserSchema = {
  name: z
    .string()
    .min(1, "الاسم مطلوب")
    .max(500, "الاسم يجب أن يكون أقل من 500 حرف"),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح")
    .max(500, "البريد الإلكتروني يجب أن يكون أقل من 500 حرف"),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف")
    .max(255, "كلمة المرور يجب أن تكون أقل من 255 حرف")
    .optional(),
  role: z
    .string()
    .refine((val) => val === "user" || val === "admin" || val === "sales", {
      message: "الدور غير صحيح",
    })
    .default("user"),
  // Sales-specific fields
  rating: z.coerce.number().min(0, "التقييم يجب أن يكون بين 0 و 5").max(5, "التقييم يجب أن يكون بين 0 و 5").optional(),
  whatsNumber: z.string().min(1, "رقم الواتساب مطلوب").max(20, "رقم الواتساب يجب أن يكون أقل من 20 حرف").optional(),
  phoneNumber: z.string().min(1, "رقم الهاتف مطلوب").max(20, "رقم الهاتف يجب أن يكون أقل من 20 حرف").optional(),
  branch: z
    .string()
    .refine((val) => !val || BRANCHES.includes(val as any), {
      message: "الفرع غير صحيح",
    })
    .optional(),
  image: z.instanceof(File).optional().or(z.string().optional()),
};

export const createUserSchema = z
  .object(baseUserSchema)
  .refine(
    (data) => {
      // If role is "sales", branch, phoneNumber, whatsNumber, and image are required
      if (data.role === "sales") {
        if (!data.branch) return false;
        if (!data.phoneNumber) return false;
        if (!data.whatsNumber) return false;
        if (!data.image) return false;
      }
      return true;
    },
    {
      message: "الفرع ورقم الهاتف ورقم الواتساب والصورة مطلوبة للدور مندوب مبيعات",
      path: ["branch"],
    }
  );

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(1, "الاسم مطلوب")
      .max(500, "الاسم يجب أن يكون أقل من 500 حرف")
      .optional(),
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("البريد الإلكتروني غير صحيح")
      .max(500, "البريد الإلكتروني يجب أن يكون أقل من 500 حرف")
      .optional(),
    password: z
      .string()
      .max(255, "كلمة المرور يجب أن تكون أقل من 255 حرف")
      .refine(
        (val) => {
          // If password is empty or undefined, it's valid (optional in edit mode)
          if (!val || val.trim() === "") return true;
          // If password is provided, it must be at least 6 characters
          return val.length >= 6;
        },
        {
          message: "كلمة المرور يجب أن تكون على الأقل 6 أحرف",
        }
      )
      .optional(),
    role: z
      .string()
      .refine((val) => !val || val === "user" || val === "admin" || val === "sales", {
        message: "الدور غير صحيح",
      })
      .optional(),
    rating: z.coerce.number().min(0, "التقييم يجب أن يكون بين 0 و 5").max(5, "التقييم يجب أن يكون بين 0 و 5").optional(),
    whatsNumber: z.string().min(1, "رقم الواتساب مطلوب").max(20, "رقم الواتساب يجب أن يكون أقل من 20 حرف").optional(),
    phoneNumber: z.string().min(1, "رقم الهاتف مطلوب").max(20, "رقم الهاتف يجب أن يكون أقل من 20 حرف").optional(),
    branch: z
      .string()
      .refine((val) => !val || BRANCHES.includes(val as any), {
        message: "الفرع غير صحيح",
      })
      .optional(),
    image: z.instanceof(File).optional().or(z.string().optional()),
  })
  .refine(
    (data) => {
      // If role is "sales", branch, phoneNumber, whatsNumber are required
      // Image is handled separately in the component
      if (data.role === "sales") {
        if (!data.branch) return false;
        if (!data.phoneNumber) return false;
        if (!data.whatsNumber) return false;
      }
      return true;
    },
    {
      message: "الفرع ورقم الهاتف ورقم الواتساب مطلوبة للدور مندوب مبيعات",
      path: ["branch"],
    }
  );

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;


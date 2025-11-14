import { z } from "zod";

export const createCarNameSchema = z.object({
  name: z
    .string()
    .min(1, "اسم السيارة مطلوب")
    .max(255, "اسم السيارة يجب أن يكون أقل من 255 حرف"),
  brandId: z.string().min(1, "الماركة مطلوبة"),
});

export const updateCarNameSchema = z.object({
  name: z
    .string()
    .min(1, "اسم السيارة مطلوب")
    .max(255, "اسم السيارة يجب أن يكون أقل من 255 حرف")
    .optional(),
  brandId: z.string().min(1, "الماركة مطلوبة").optional(),
});

export type CreateCarNameFormData = z.infer<typeof createCarNameSchema>;
export type UpdateCarNameFormData = z.infer<typeof updateCarNameSchema>;


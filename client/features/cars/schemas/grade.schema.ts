import { z } from "zod";

export const createGradeSchema = z.object({
  name: z
    .string()
    .min(1, "اسم الدرجة مطلوب")
    .max(255, "اسم الدرجة يجب أن يكون أقل من 255 حرف"),
  carNameId: z.string().min(1, "اسم السيارة مطلوب"),
});

export const updateGradeSchema = z.object({
  name: z
    .string()
    .min(1, "اسم الدرجة مطلوب")
    .max(255, "اسم الدرجة يجب أن يكون أقل من 255 حرف")
    .optional(),
  carNameId: z.string().min(1, "اسم السيارة مطلوب").optional(),
});

export type CreateGradeFormData = z.infer<typeof createGradeSchema>;
export type UpdateGradeFormData = z.infer<typeof updateGradeSchema>;


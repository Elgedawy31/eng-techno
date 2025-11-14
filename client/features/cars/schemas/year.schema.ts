import { z } from "zod";

export const createYearSchema = z.object({
  value: z
    .coerce
    .number()
    .int("السنة يجب أن تكون رقماً صحيحاً")
    .min(1900, "السنة يجب أن تكون أكبر من أو تساوي 1900")
    .max(2100, "السنة يجب أن تكون أقل من أو تساوي 2100"),
  gradeId: z.string().min(1, "الدرجة مطلوبة"),
});

export const updateYearSchema = z.object({
  value: z
    .coerce
    .number()
    .int("السنة يجب أن تكون رقماً صحيحاً")
    .min(1900, "السنة يجب أن تكون أكبر من أو تساوي 1900")
    .max(2100, "السنة يجب أن تكون أقل من أو تساوي 2100")
    .optional(),
  gradeId: z.string().min(1, "الدرجة مطلوبة").optional(),
});

export type CreateYearFormData = z.infer<typeof createYearSchema>;
export type UpdateYearFormData = z.infer<typeof updateYearSchema>;


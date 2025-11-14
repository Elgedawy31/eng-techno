import { z } from "zod";

export const createAgentSchema = z.object({
  name: z
    .string()
    .min(1, "اسم الوكيل مطلوب")
    .max(255, "اسم الوكيل يجب أن يكون أقل من 255 حرف"),
  brandId: z.string().min(1, "الماركة مطلوبة"),
});

export const updateAgentSchema = z.object({
  name: z
    .string()
    .min(1, "اسم الوكيل مطلوب")
    .max(255, "اسم الوكيل يجب أن يكون أقل من 255 حرف")
    .optional(),
  brandId: z.string().min(1, "الماركة مطلوبة").optional(),
});

export type CreateAgentFormData = z.infer<typeof createAgentSchema>;
export type UpdateAgentFormData = z.infer<typeof updateAgentSchema>;


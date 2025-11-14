import { z } from "zod";

const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "حجم الصورة يجب أن يكون أقل من 5 ميجابايت"
  )
  .refine(
    (file) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
    "نوع الملف غير مدعوم. يرجى استخدام JPEG أو PNG أو WebP"
  );

export const createBrandSchema = z.object({
  name: z
    .string()
    .min(1, "اسم الماركة مطلوب")
    .max(255, "اسم الماركة يجب أن يكون أقل من 255 حرف"),
  image: imageFileSchema.optional(),
});

export const updateBrandSchema = z.object({
  name: z
    .string()
    .min(1, "اسم الماركة مطلوب")
    .max(255, "اسم الماركة يجب أن يكون أقل من 255 حرف")
    .optional(),
  image: imageFileSchema.optional(),
});

export type CreateBrandFormData = z.infer<typeof createBrandSchema>;
export type UpdateBrandFormData = z.infer<typeof updateBrandSchema>;


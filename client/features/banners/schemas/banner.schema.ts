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

export const createBannerSchema = z.object({
  bannername: z
    .string()
    .min(1, "اسم البانر مطلوب")
    .max(255, "اسم البانر يجب أن يكون أقل من 255 حرف"),
  expiration_date: z
    .string()
    .min(1, "تاريخ الانتهاء مطلوب")
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: "تاريخ الانتهاء يجب أن يكون تاريخًا مستقبليًا",
      }
    ),
  large_image: imageFileSchema,
  small_image: imageFileSchema.optional(),
});

export const updateBannerSchema = z.object({
  bannername: z
    .string()
    .min(1, "اسم البانر مطلوب")
    .max(255, "اسم البانر يجب أن يكون أقل من 255 حرف")
    .optional(),
  expiration_date: z
    .string()
    .min(1, "تاريخ الانتهاء مطلوب")
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: "تاريخ الانتهاء يجب أن يكون تاريخًا مستقبليًا",
      }
    )
    .optional(),
  large_image: imageFileSchema.optional(),
  small_image: imageFileSchema.optional(),
});

export type CreateBannerFormData = z.infer<typeof createBannerSchema>;
export type UpdateBannerFormData = z.infer<typeof updateBannerSchema>;


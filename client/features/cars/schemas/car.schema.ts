import { z } from "zod";

export const CAR_STATUSES = [
  "available",
  "reserved",
  "sold",
  "maintenance",
] as const;

export type CarStatus = (typeof CAR_STATUSES)[number];

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

// Helper to parse array from string or array
const arraySchema = z.preprocess(
  (val) => {
    if (val === undefined || val === null) return undefined;
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val.split(",").map((item: string) => item.trim()).filter(Boolean);
      }
    }
    return Array.isArray(val) ? val : undefined;
  },
  z.array(z.string())
);

// Step 1: General Data Schema
export const generalDataSchema = z.object({
  brandId: z.string().min(1, "الماركة مطلوبة"),
  agentId: z.string().optional(),
  carNameId: z.string().min(1, "اسم السيارة مطلوب"),
  gradeId: z.string().min(1, "الدرجة مطلوبة"),
  yearId: z.string().min(1, "السنة مطلوبة"),
});

// Step 2: Specific Data Schema
export const specificDataSchema = z.object({
  chassis: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val.split(",").map((item: string) => item.trim()).filter(Boolean);
        }
      }
      return Array.isArray(val) ? val : [];
    },
    z.array(z.string().min(1, "رقم الشاسيه مطلوب")).min(1, "يجب إدخال رقم شاسيه واحد على الأقل")
  ),
  internalColors: arraySchema.optional(),
  externalColors: arraySchema.optional(),
  priceCash: z.coerce.number().min(0, "السعر النقدي يجب أن يكون أكبر من أو يساوي 0"),
  priceFinance: z.coerce.number().min(0, "السعر بالتقسيط يجب أن يكون أكبر من أو يساوي 0"),
  status: z.enum(CAR_STATUSES as unknown as [string, ...string[]]).default("available"),
  reservedBy: z.string().optional().nullable(),
  engine_capacity: z.coerce.number().min(0).optional(),
  transmission: z.enum(["manual", "automatic"]).default("automatic").optional(),
  fuel_capacity: z.coerce.number().min(0).optional(),
  seat_type: z.string().trim().max(255).optional(),
  location: z.string().trim().max(255).optional(),
});

// Step 3: Images and Description Schema
export const imagesAndDescriptionSchema = z.object({
  images: z.array(imageFileSchema).min(1, "يجب إضافة صورة واحدة على الأقل"),
  description: z.string().trim().optional(),
});

// Combined Schema for Create
export const createCarSchema = generalDataSchema.extend(specificDataSchema.shape).extend(imagesAndDescriptionSchema.shape);

// Update Schemas (all fields optional)
export const updateGeneralDataSchema = z.object({
  brandId: z.string().min(1, "الماركة مطلوبة").optional(),
  agentId: z.string().min(1, "الوكيل مطلوب").optional(),
  carNameId: z.string().min(1, "اسم السيارة مطلوب").optional(),
  gradeId: z.string().min(1, "الدرجة مطلوبة").optional(),
  yearId: z.string().min(1, "السنة مطلوبة").optional(),
});

export const updateSpecificDataSchema = z.object({
  chassis: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val.split(",").map((item: string) => item.trim()).filter(Boolean);
        }
      }
      return Array.isArray(val) ? val : [];
    },
    z.array(z.string().min(1)).optional()
  ),
  internalColors: arraySchema,
  externalColors: arraySchema,
  priceCash: z.coerce.number().min(0).optional(),
  priceFinance: z.coerce.number().min(0).optional(),
  status: z.enum(CAR_STATUSES as unknown as [string, ...string[]]).optional(),
  reservedBy: z.string().optional().nullable(),
  engine_capacity: z.coerce.number().min(0).optional(),
  transmission: z.enum(["manual", "automatic"]).optional(),
  fuel_capacity: z.coerce.number().min(0).optional(),
  seat_type: z.string().trim().max(255).optional(),
  location: z.string().trim().max(255).optional(),
});

export const updateImagesAndDescriptionSchema = z.object({
  images: z.array(imageFileSchema).optional(),
  description: z.string().trim().optional(),
});

// Combined Schema for Update
export const updateCarSchema = updateGeneralDataSchema.extend(updateSpecificDataSchema.shape).extend(updateImagesAndDescriptionSchema.shape);

// Type exports
export type GeneralDataFormData = z.infer<typeof generalDataSchema>;
export type SpecificDataFormData = z.infer<typeof specificDataSchema>;
export type ImagesAndDescriptionFormData = z.infer<typeof imagesAndDescriptionSchema>;
export type CreateCarFormData = z.infer<typeof createCarSchema>;
export type UpdateCarFormData = z.infer<typeof updateCarSchema>;


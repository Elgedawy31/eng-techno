"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { imagesAndDescriptionSchema, updateImagesAndDescriptionSchema, type ImagesAndDescriptionFormData } from "@/features/cars/schemas/car.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils/image.utils";

interface ImagesAndDescriptionStepProps {
  defaultValues?: Partial<ImagesAndDescriptionFormData>;
  onSubmit: (data: ImagesAndDescriptionFormData & { existingImagesToKeep?: string[] }) => void | Promise<void>;
  existingImages?: string[]; // URLs of existing images from the server
  onPrevious?: (data: ImagesAndDescriptionFormData & { existingImagesToKeep?: string[] }) => void;
  isSubmitting?: boolean;
}

function ImagesAndDescriptionStep({ defaultValues, onSubmit, existingImages = [], onPrevious, isSubmitting = false }: ImagesAndDescriptionStepProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 10;

  // Use update schema if there are existing images (edit mode), otherwise use create schema
  const isEditMode = existingImages && existingImages.length > 0;
  const schema = isEditMode 
    ? updateImagesAndDescriptionSchema 
    : imagesAndDescriptionSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    setError,
    clearErrors,
    getValues,
  } = useForm<ImagesAndDescriptionFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any, // Type assertion needed because schema type changes based on edit mode
    defaultValues: defaultValues || {
      images: [],
      description: "",
    },
  });

  // Initialize existing images when component mounts or existingImages change
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      const imageUrls = existingImages.map((img) => getImageUrl(img) || "").filter(Boolean);
      // Use a single state update to avoid cascading renders
      setExistingImageUrls(imageUrls);
      setImagePreviews(imageUrls);
    } else if (existingImages?.length === 0) {
      setExistingImageUrls([]);
      if (imagePreviews.length === 0) {
        setImagePreviews([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingImages]);

  // Restore form data when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset({
        description: defaultValues.description || "",
        images: defaultValues.images || [],
      });
    }
  }, [defaultValues, reset]);

  // Initialize files and previews from default values (create mode when navigating back)
  useEffect(() => {
    const initFromDefaults = async () => {
      const filesFromDefaults = (defaultValues?.images as File[] | undefined) || [];
      if (!isEditMode && filesFromDefaults.length > 0) {
        setImageFiles(filesFromDefaults);
        const previewPromises = filesFromDefaults.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            })
        );
        const previews = await Promise.all(previewPromises);
        setImagePreviews(previews);
      }
      if (!isEditMode && filesFromDefaults.length === 0) {
        setImageFiles([]);
        setImagePreviews([]);
      }
    };
    void initFromDefaults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.images, isEditMode]);

  // Handle image file changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Check total images count
    const totalImages = imageFiles.length + files.length;
    if (totalImages > MAX_IMAGES) {
      alert(`يمكنك تحميل ما يصل إلى ${MAX_IMAGES} صورة فقط`);
      return;
    }

    // Validate file types and sizes
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
        invalidFiles.push(`${file.name}: نوع الملف غير مدعوم`);
      } else if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name}: حجم الملف أكبر من 5 ميجابايت`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      alert(`الملفات التالية غير صالحة:\n${invalidFiles.join("\n")}`);
    }

    if (validFiles.length > 0) {
      const newFiles = [...imageFiles, ...validFiles];
      setImageFiles(newFiles);
      setValue("images", newFiles, { shouldValidate: true });

      // Create previews for new files
      const previewPromises = validFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(previewPromises).then((previews) => {
        setImagePreviews((prev) => [...prev, ...previews]);
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    // Check if we're removing an existing image (from existingImageUrls) or a new file
    const totalExisting = existingImageUrls.length;
    
    if (index < totalExisting) {
      // Removing an existing image - remove from existingImageUrls
      const newExisting = existingImageUrls.filter((_, i) => i !== index);
      setExistingImageUrls(newExisting);
      setImagePreviews(newExisting.concat(imagePreviews.slice(totalExisting)));
    } else {
      // Removing a new file - remove from imageFiles
      const fileIndex = index - totalExisting;
      const newFiles = imageFiles.filter((_, i) => i !== fileIndex);
      const newPreviews = imagePreviews.filter((_, i) => i !== index);
      
      setImageFiles(newFiles);
      setImagePreviews(newPreviews);
      setValue("images", newFiles, { shouldValidate: true });
    }
  };

  // Build current payload (new files + existing images to keep)
  const buildCurrentPayload = (base: ImagesAndDescriptionFormData): ImagesAndDescriptionFormData & { existingImagesToKeep?: string[] } => {
    const existingImagesToKeep: string[] | undefined =
      existingImages && existingImages.length > 0
        ? (() => {
            const kept: string[] = [];
            existingImageUrls.forEach((url) => {
              const originalImage = existingImages.find((img) => {
                const transformedUrl = getImageUrl(img);
                return transformedUrl === url;
              });
              if (originalImage) kept.push(originalImage);
            });
            return kept.length > 0 ? kept : undefined;
          })()
        : undefined;
    return { ...base, images: imageFiles, existingImagesToKeep };
  };

  const handleFormSubmit = async (data: ImagesAndDescriptionFormData) => {
    // Validate that we have at least one image total (existing + new)
    const totalImages = existingImageUrls.length + imageFiles.length;
    if (totalImages === 0) {
      // Set custom error for images field
      setError("images", {
        type: "manual",
        message: "يجب إضافة صورة واحدة على الأقل",
      });
      return;
    }

    // Clear any previous errors
    clearErrors("images");

    await onSubmit(buildCurrentPayload(data));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">
          الصور والوصف
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          أضف صور السيارة واكتب وصفاً مفصلاً
        </p>
      </div>

      {/* Images Upload Section */}
      <div className="space-y-2">
        <Label htmlFor="images">
          صور السيارة <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* All Image Previews (existing + new) */}
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border">
                <Image
                  src={preview}
                  alt={`معاينة الصورة ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Upload Area */}
          {(existingImageUrls.length + imageFiles.length) < MAX_IMAGES && (
            <div className="flex items-center justify-center">
              <Label
                htmlFor="images"
                className={cn(
                  "flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors",
                  errors.images && "border-destructive"
                )}
              >
                <div className="flex flex-col items-center justify-center p-4">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-1 text-sm text-center text-muted-foreground">
                    <span className="font-semibold">انقر للتحميل</span>
                  </p>
                  <p className="text-xs text-center text-muted-foreground">
                    PNG, JPG, WEBP
                  </p>
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    ({(existingImageUrls.length + imageFiles.length)}/{MAX_IMAGES})
                  </p>
                </div>
                <Input
                  ref={fileInputRef}
                  id="images"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </Label>
            </div>
          )}
        </div>
        {errors.images && (
          <p className="text-sm text-destructive" role="alert">
            {errors.images.message}
          </p>
        )}
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="أدخل وصفاً مفصلاً للسيارة..."
          rows={6}
          className={cn(errors.description && "border-destructive ring-destructive/20")}
          aria-invalid={errors.description ? "true" : "false"}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && (
          <p id="description-error" className="text-sm text-destructive" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        {onPrevious && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const payload = buildCurrentPayload({
                description: getValues("description") || "",
                images: imageFiles,
              });
              onPrevious(payload);
            }}
            disabled={isSubmitting}
          >
            السابق
          </Button>
        )}
        <Button type="submit" className={onPrevious ? "" : "ml-auto"} disabled={isSubmitting}>
          {isSubmitting ? "جاري الإرسال..." : "إرسال"}
        </Button>
      </div>
    </form>
  );
}

export default ImagesAndDescriptionStep;


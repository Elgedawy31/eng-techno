"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import {
  createBannerSchema,
  updateBannerSchema,
  type CreateBannerFormData,
  type UpdateBannerFormData,
} from "../schemas/banner.schema";
import { useCreateBanner } from "../hooks/useCreateBanner";
import { useUpdateBanner } from "../hooks/useUpdateBanner";
import type { Banner } from "../services/bannerService";
import { getImageUrl } from "@/utils/image.utils";
import { cn } from "@/lib/utils";

interface BannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner | null;
}

export function AddBannerDialog({ open, onOpenChange, banner }: BannerDialogProps) {
  const isEditMode = !!banner;
  const { createBanner, isPending: isCreating } = useCreateBanner();
  const { updateBanner, isPending: isUpdating } = useUpdateBanner();
  const isPending = isCreating || isUpdating;

  const [largeImagePreview, setLargeImagePreview] = useState<string | null>(null);
  const [smallImagePreview, setSmallImagePreview] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // Get existing image URLs for edit mode
  const existingLargeImageUrl = banner ? getImageUrl(banner.image_path_lg) : null;
  const existingSmallImageUrl = banner ? getImageUrl(banner.image_path_small) : null;

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateBannerFormData | UpdateBannerFormData>({
    resolver: zodResolver(isEditMode ? updateBannerSchema : createBannerSchema),
    defaultValues: isEditMode && banner
      ? {
          bannername: banner.bannername || "",
          expiration_date: formatDateForInput(banner.expiration_date),
          large_image: undefined,
          small_image: undefined,
        }
      : {
          bannername: "",
          expiration_date: "",
          small_image: undefined,
        },
  });

  // Reset form when banner changes (switching between create/edit)
  useEffect(() => {
    if (open) {
      if (isEditMode && banner) {
        reset({
          bannername: banner.bannername || "",
          expiration_date: formatDateForInput(banner.expiration_date),
          large_image: undefined,
          small_image: undefined,
        });
        setLargeImagePreview(existingLargeImageUrl);
        setSmallImagePreview(existingSmallImageUrl);
      } else {
        reset({
          bannername: "",
          expiration_date: "",
          small_image: undefined,
        });
        setLargeImagePreview(null);
        setSmallImagePreview(null);
      }
      setFileInputKey((prev) => prev + 1);
    }
  }, [open, banner, isEditMode, reset, existingLargeImageUrl, existingSmallImageUrl]);

  const largeImageFile = watch("large_image");
  const smallImageFile = watch("small_image");

  // Set existing images as preview when in edit mode
  useEffect(() => {
    if (isEditMode && !largeImageFile && existingLargeImageUrl) {
      setLargeImagePreview(existingLargeImageUrl);
    }
  }, [isEditMode, largeImageFile, existingLargeImageUrl]);

  useEffect(() => {
    if (isEditMode && !smallImageFile && existingSmallImageUrl) {
      setSmallImagePreview(existingSmallImageUrl);
    }
  }, [isEditMode, smallImageFile, existingSmallImageUrl]);

  // Handle large image preview
  useEffect(() => {
    if (largeImageFile && largeImageFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLargeImagePreview(reader.result as string);
      };
      reader.readAsDataURL(largeImageFile);
    } else if (!isEditMode || !existingLargeImageUrl) {
      setLargeImagePreview(null);
    }
  }, [largeImageFile, isEditMode, existingLargeImageUrl]);

  // Handle small image preview
  useEffect(() => {
    if (smallImageFile && smallImageFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSmallImagePreview(reader.result as string);
      };
      reader.readAsDataURL(smallImageFile);
    } else if (!isEditMode || !existingSmallImageUrl) {
      setSmallImagePreview(null);
    }
  }, [smallImageFile, isEditMode, existingSmallImageUrl]);

  const onSubmit = async (data: CreateBannerFormData | UpdateBannerFormData) => {
    try {
      if (isEditMode && banner) {
        // Update mode
        const updatePayload: {
          bannername?: string;
          expiration_date?: string;
          large_image?: File;
          small_image?: File;
        } = {};

        if (data.bannername) updatePayload.bannername = data.bannername;
        if (data.expiration_date) updatePayload.expiration_date = data.expiration_date;
        if (data.large_image instanceof File) updatePayload.large_image = data.large_image;
        if (data.small_image instanceof File) updatePayload.small_image = data.small_image;

        await updateBanner({
          id: banner._id,
          payload: updatePayload,
        });
      } else {
        // Create mode
        await createBanner({
          bannername: (data as CreateBannerFormData).bannername,
          expiration_date: (data as CreateBannerFormData).expiration_date,
          large_image: (data as CreateBannerFormData).large_image,
          small_image: (data as CreateBannerFormData).small_image,
        });
      }
      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error(`Error ${isEditMode ? "updating" : "creating"} banner:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && banner
        ? {
            bannername: banner.bannername || "",
            expiration_date: formatDateForInput(banner.expiration_date),
            large_image: undefined,
            small_image: undefined,
          }
        : {
            bannername: "",
            expiration_date: "",
            small_image: undefined,
          }
    );
    setLargeImagePreview(isEditMode && existingLargeImageUrl ? existingLargeImageUrl : null);
    setSmallImagePreview(isEditMode && existingSmallImageUrl ? existingSmallImageUrl : null);
    setFileInputKey((prev) => prev + 1);
    onOpenChange(false);
  };

  const handleLargeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("large_image", file, { shouldValidate: true });
    }
  };

  const handleSmallImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("small_image", file, { shouldValidate: true });
    } else {
      setValue("small_image", undefined, { shouldValidate: false });
    }
  };

  const removeLargeImage = () => {
    setValue("large_image", undefined as unknown as File, { shouldValidate: false });
    // In edit mode, keep showing existing image if no new file selected
    if (!isEditMode || !existingLargeImageUrl) {
      setLargeImagePreview(null);
    } else {
      setLargeImagePreview(existingLargeImageUrl);
    }
  };

  const removeSmallImage = () => {
    setValue("small_image", undefined, { shouldValidate: false });
    // In edit mode, keep showing existing image if no new file selected
    if (!isEditMode || !existingSmallImageUrl) {
      setSmallImagePreview(null);
    } else {
      setSmallImagePreview(existingSmallImageUrl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "تعديل البانر" : "إضافة بانر جديد"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "قم بتعديل البيانات التالية"
              : "قم بملء البيانات التالية لإضافة بانر جديد"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Banner Name */}
          <FormField
            label="اسم البانر"
            name="bannername"
            type="text"
            placeholder="أدخل اسم البانر"
            register={register("bannername")}
            error={errors.bannername}
            required={!isEditMode}
          />

          {/* Expiration Date */}
          <FormField
            label="تاريخ الانتهاء"
            name="expiration_date"
            type="date"
            register={register("expiration_date")}
            error={errors.expiration_date}
            required={!isEditMode}
          />

          {/* Large Image */}
          <div className="space-y-2">
            <Label htmlFor="large_image">
              الصورة الكبيرة {!isEditMode && <span className="text-destructive">*</span>}
            </Label>
            {largeImagePreview ? (
              <div className="relative">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                  <Image
                    src={largeImagePreview}
                    alt="معاينة الصورة الكبيرة"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={removeLargeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <Label
                  htmlFor="large_image"
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors",
                    errors.large_image && "border-destructive"
                  )}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">انقر للتحميل</span> أو اسحب
                      وأفلت
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP (حد أقصى 5 ميجابايت)
                    </p>
                  </div>
                  <Input
                    key={`large-${fileInputKey}`}
                    id="large_image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleLargeImageChange}
                  />
                </Label>
              </div>
            )}
            {errors.large_image && (
              <p className="text-sm text-destructive" role="alert">
                {errors.large_image.message}
              </p>
            )}
          </div>

          {/* Small Image (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="small_image">الصورة الصغيرة (اختياري)</Label>
            {smallImagePreview ? (
              <div className="relative">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                  <Image
                    src={smallImagePreview}
                    alt="معاينة الصورة الصغيرة"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={removeSmallImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <Label
                  htmlFor="small_image"
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors",
                    errors.small_image && "border-destructive"
                  )}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">انقر للتحميل</span> أو اسحب
                      وأفلت
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP (حد أقصى 5 ميجابايت)
                    </p>
                  </div>
                  <Input
                    key={`small-${fileInputKey}`}
                    id="small_image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleSmallImageChange}
                  />
                </Label>
              </div>
            )}
            {errors.small_image && (
              <p className="text-sm text-destructive" role="alert">
                {errors.small_image.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditMode
                  ? "جاري التحديث..."
                  : "جاري الإضافة..."
                : isEditMode
                ? "تحديث البانر"
                : "إضافة البانر"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


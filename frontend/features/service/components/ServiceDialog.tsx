"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { ImageUpload } from "@/components/shared/ImageUpload";
import {
  createServiceSchema,
  updateServiceSchema,
  type CreateServiceFormData,
  type UpdateServiceFormData,
} from "../schemas/service.schema";
import { useCreateService } from "../hooks/useCreateService";
import { useUpdateService } from "../hooks/useUpdateService";
import type { Service } from "../services/serviceService";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
}

export function ServiceDialog({ open, onOpenChange, service }: ServiceDialogProps) {
  const isEditMode = !!service;
  const { createService, isPending: isCreating } = useCreateService();
  const { updateService, isPending: isUpdating } = useUpdateService();
  const isPending = isCreating || isUpdating;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<CreateServiceFormData | UpdateServiceFormData>({
    resolver: zodResolver(
      isEditMode ? updateServiceSchema : createServiceSchema
    ) as Resolver<CreateServiceFormData | UpdateServiceFormData>,
    defaultValues: isEditMode && service
      ? {
          title: service.title || "",
          description: service.description || "",
          categoryTags: service.categoryTags || [],
          buttonText: service.buttonText || "EXPLORE",
          buttonAction: service.buttonAction || "",
          additionalText: service.additionalText || "",
          order: service.order ?? 0,
          isActive: service.isActive ?? true,
        }
      : {
          title: "",
          description: "",
          categoryTags: [],
          buttonText: "EXPLORE",
          buttonAction: "",
          additionalText: "",
          order: 0,
          isActive: true,
        },
  });

  const categoryTags = watch("categoryTags") || [];

  // Reset form when service changes (switching between create/edit)
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && service) {
        reset({
          title: service.title || "",
          description: service.description || "",
          categoryTags: service.categoryTags || [],
          buttonText: service.buttonText || "EXPLORE",
          buttonAction: service.buttonAction || "",
          additionalText: service.additionalText || "",
          order: service.order ?? 0,
          isActive: service.isActive ?? true,
        });
        setTagInput("");
      } else {
        reset({
          title: "",
          description: "",
          categoryTags: [],
          buttonText: "EXPLORE",
          buttonAction: "",
          additionalText: "",
          order: 0,
          isActive: true,
        });
        setTagInput("");
      }
      setImageFile(null);
      setImageRemoved(false);
    };

    resetForm();
  }, [open, service, isEditMode, reset]);

  const handleAddTag = () => {
    if (tagInput.trim() && categoryTags.length < 10) {
      const newTags = [...categoryTags, tagInput.trim()];
      setValue("categoryTags", newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = categoryTags.filter((_, i) => i !== index);
    setValue("categoryTags", newTags);
  };

  const onSubmit = async (data: CreateServiceFormData | UpdateServiceFormData) => {
    try {
      if (isEditMode && service) {
        // Update mode
        const updatePayload: {
          title?: string;
          description?: string;
          categoryTags?: string[];
          buttonText?: string;
          buttonAction?: string;
          additionalText?: string;
          order?: number;
          isActive?: boolean;
          backgroundImage?: File;
        } = {};

        if (data.title) updatePayload.title = data.title;
        if (data.description) updatePayload.description = data.description;
        if (data.categoryTags !== undefined) updatePayload.categoryTags = data.categoryTags;
        if (data.buttonText) updatePayload.buttonText = data.buttonText;
        if (data.buttonAction) updatePayload.buttonAction = data.buttonAction;
        if (data.additionalText !== undefined) updatePayload.additionalText = data.additionalText;
        if (data.order !== undefined) updatePayload.order = data.order;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
        if (imageFile) {
          updatePayload.backgroundImage = imageFile;
        }

        await updateService({
          id: service._id,
          payload: updatePayload,
        });
      } else {
        // Create mode
        if (!imageFile) {
          return; // Image is required for create
        }

        const createPayload = {
          title: (data as CreateServiceFormData).title,
          description: (data as CreateServiceFormData).description,
          categoryTags: (data as CreateServiceFormData).categoryTags || [],
          buttonText: (data as CreateServiceFormData).buttonText,
          buttonAction: (data as CreateServiceFormData).buttonAction,
          additionalText: (data as CreateServiceFormData).additionalText,
          order: (data as CreateServiceFormData).order ?? 0,
          isActive: (data as CreateServiceFormData).isActive ?? true,
          backgroundImage: imageFile,
        };

        await createService(createPayload);
      }
      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error(`Error ${isEditMode ? "updating" : "creating"} service:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && service
        ? {
            title: service.title || "",
            description: service.description || "",
            categoryTags: service.categoryTags || [],
            buttonText: service.buttonText || "EXPLORE",
            buttonAction: service.buttonAction || "",
            additionalText: service.additionalText || "",
            order: service.order ?? 0,
            isActive: service.isActive ?? true,
          }
        : {
            title: "",
            description: "",
            categoryTags: [],
            buttonText: "EXPLORE",
            buttonAction: "",
            additionalText: "",
            order: 0,
            isActive: true,
          }
    );
    setImageFile(null);
    setImageRemoved(false);
    setTagInput("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Service" : "Add New Service"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the service information"
              : "Fill in the following information to add a new service"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Background Image */}
          <div className="space-y-2">
            <Label htmlFor="backgroundImage">
              Background Image {!isEditMode && <span className="text-destructive">*</span>}
              {isEditMode && (
                <span className="text-muted-foreground text-xs ml-2">
                  (Leave empty if you don&apos;t want to change it)
                </span>
              )}
            </Label>
            <Controller
              name="backgroundImage"
              control={control}
              render={({ field: { onChange, onBlur } }: { field: { onChange: (value: File | undefined) => void; onBlur: () => void } }) => {
                let displayValue: File | string | null = null;
                if (imageRemoved) {
                  displayValue = null;
                } else if (imageFile) {
                  displayValue = imageFile;
                } else if (isEditMode && service?.backgroundImage) {
                  displayValue = service.backgroundImage;
                }

                return (
                  <ImageUpload
                    value={displayValue}
                    onChange={(file) => {
                      if (file === null) {
                        setImageFile(null);
                        setImageRemoved(true);
                        onChange(undefined);
                      } else {
                        setImageFile(file);
                        setImageRemoved(false);
                        onChange(file);
                      }
                    }}
                    onBlur={onBlur}
                    error={errors.backgroundImage}
                    disabled={isPending}
                  />
                );
              }}
            />
          </div>

          {/* Title */}
          <FormField
            label="Title"
            name="title"
            type="text"
            placeholder="Enter title"
            register={register("title")}
            error={errors.title}
            required={!isEditMode}
          />

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description {!isEditMode && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              {...register("description")}
              className={cn(errors.description && "border-destructive")}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category Tags */}
          <div className="space-y-2">
            <Label htmlFor="categoryTags">
              Category Tags (Max 10)
            </Label>
            <div className="flex gap-2">
              <Input
                id="categoryTags"
                type="text"
                placeholder="Enter tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                disabled={isPending || categoryTags.length >= 10}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={isPending || !tagInput.trim() || categoryTags.length >= 10}
              >
                Add
              </Button>
            </div>
            {categoryTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {categoryTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      disabled={isPending}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {errors.categoryTags && (
              <p className="text-sm text-destructive" role="alert">
                {errors.categoryTags.message}
              </p>
            )}
          </div>

          {/* Button Text */}
          <FormField
            label="Button Text"
            name="buttonText"
            type="text"
            placeholder="Enter button text"
            register={register("buttonText")}
            error={errors.buttonText}
            required={!isEditMode}
          />

          {/* Button Action */}
          <FormField
            label="Button Action"
            name="buttonAction"
            type="text"
            placeholder="Enter button action URL or path"
            register={register("buttonAction")}
            error={errors.buttonAction}
            required={!isEditMode}
          />

          {/* Additional Text */}
          <div className="space-y-2">
            <Label htmlFor="additionalText">
              Additional Text
            </Label>
            <Textarea
              id="additionalText"
              placeholder="Enter additional text (optional)"
              {...register("additionalText")}
              className={cn(errors.additionalText && "border-destructive")}
              rows={4}
            />
            {errors.additionalText && (
              <p className="text-sm text-destructive" role="alert">
                {errors.additionalText.message}
              </p>
            )}
          </div>

          {/* Order */}
          <FormField
            label="Order"
            name="order"
            type="number"
            placeholder="Enter order (0 for default)"
            register={register("order", { valueAsNumber: true })}
            error={errors.order}
          />

          {/* Is Active */}
          <div className="flex items-center space-x-2">
            <Controller
              name="isActive"
              control={control}
              render={({ field }: { field: { value: boolean | undefined; onChange: (value: boolean) => void } }) => (
                <>
                  <Checkbox
                    id="isActive"
                    checked={field.value ?? true}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                  <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                    Active
                  </Label>
                </>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || (!isEditMode && !imageFile)}>
              {isPending
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Service"
                : "Create Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


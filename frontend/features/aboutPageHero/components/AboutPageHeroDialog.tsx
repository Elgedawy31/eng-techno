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
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { ImageUpload } from "@/components/shared/ImageUpload";
import {
  createOrUpdateAboutPageHeroSchema,
  updateAboutPageHeroSchema,
  type CreateOrUpdateAboutPageHeroFormData,
  type UpdateAboutPageHeroFormData,
} from "../schemas/aboutPageHero.schema";
import { useCreateOrUpdateAboutPageHero } from "../hooks/useCreateOrUpdateAboutPageHero";
import { useUpdateAboutPageHero } from "../hooks/useUpdateAboutPageHero";
import type { AboutPageHero } from "../services/aboutPageHeroService";

interface AboutPageHeroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aboutPageHero?: AboutPageHero | null;
}

export function AboutPageHeroDialog({ open, onOpenChange, aboutPageHero }: AboutPageHeroDialogProps) {
  const isEditMode = !!aboutPageHero;
  const { createOrUpdateAboutPageHero, isPending: isCreating } = useCreateOrUpdateAboutPageHero();
  const { updateAboutPageHero, isPending: isUpdating } = useUpdateAboutPageHero();
  const isPending = isCreating || isUpdating;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOrUpdateAboutPageHeroFormData | UpdateAboutPageHeroFormData>({
    resolver: zodResolver(
      isEditMode ? updateAboutPageHeroSchema : createOrUpdateAboutPageHeroSchema
    ) as Resolver<CreateOrUpdateAboutPageHeroFormData | UpdateAboutPageHeroFormData>,
    defaultValues: isEditMode && aboutPageHero
      ? {
          title: aboutPageHero.title || "",
          isActive: aboutPageHero.isActive ?? true,
        }
      : {
          title: "",
          isActive: true,
        },
  });

  // Reset form when aboutPageHero changes (switching between create/edit)
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && aboutPageHero) {
        reset({
          title: aboutPageHero.title || "",
          isActive: aboutPageHero.isActive ?? true,
        });
      } else {
        reset({
          title: "",
          isActive: true,
        });
      }
      setImageFile(null);
      setImageRemoved(false);
    };

    resetForm();
  }, [open, aboutPageHero, isEditMode, reset]);

  const onSubmit = async (data: CreateOrUpdateAboutPageHeroFormData | UpdateAboutPageHeroFormData) => {
    try {
      if (isEditMode && aboutPageHero) {
        // Update mode
        const updatePayload: {
          title?: string;
          isActive?: boolean;
          backgroundImage?: File;
        } = {};

        if (data.title) updatePayload.title = data.title;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
        if (imageFile) {
          updatePayload.backgroundImage = imageFile;
        } else if (imageRemoved) {
          // If image was explicitly removed, we need to handle it
          // Note: The backend might need to handle empty image differently
          // For now, we'll only send the image if a new one is uploaded
        }

        await updateAboutPageHero({
          id: aboutPageHero._id,
          payload: updatePayload,
        });
      } else {
        // Create mode
        if (!imageFile) {
          return; // Image is required for create
        }

        const createPayload = {
          title: (data as CreateOrUpdateAboutPageHeroFormData).title,
          isActive: (data as CreateOrUpdateAboutPageHeroFormData).isActive ?? true,
          backgroundImage: imageFile,
        };

        await createOrUpdateAboutPageHero(createPayload);
      }
      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error(`Error ${isEditMode ? "updating" : "creating"} about page hero:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && aboutPageHero
        ? {
            title: aboutPageHero.title || "",
            isActive: aboutPageHero.isActive ?? true,
          }
        : {
            title: "",
            isActive: true,
          }
    );
    setImageFile(null);
    setImageRemoved(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit About Page Hero" : "Add New About Page Hero"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the about page hero information"
              : "Fill in the following information to add a new about page hero"}
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
                // Determine the value to display
                let displayValue: File | string | null = null;
                if (imageRemoved) {
                  displayValue = null;
                } else if (imageFile) {
                  displayValue = imageFile;
                } else if (isEditMode && aboutPageHero?.backgroundImage) {
                  displayValue = aboutPageHero.backgroundImage;
                }

                return (
                  <ImageUpload
                    value={displayValue}
                    onChange={(file) => {
                      if (file === null) {
                        // Image was removed
                        setImageFile(null);
                        setImageRemoved(true);
                        onChange(undefined);
                      } else {
                        // New image was selected
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
                ? "Update Hero"
                : "Create Hero"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


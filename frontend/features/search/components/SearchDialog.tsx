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
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { ImageUpload } from "@/components/shared/ImageUpload";
import {
  createOrUpdateSearchSchema,
  updateSearchSchema,
  type CreateOrUpdateSearchFormData,
  type UpdateSearchFormData,
} from "../schemas/search.schema";
import { useCreateOrUpdateSearch } from "../hooks/useCreateOrUpdateSearch";
import { useUpdateSearch } from "../hooks/useUpdateSearch";
import type { Search } from "../services/searchService";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search?: Search | null;
}

export function SearchDialog({ open, onOpenChange, search }: SearchDialogProps) {
  const isEditMode = !!search;
  const { createOrUpdateSearch, isPending: isCreating } = useCreateOrUpdateSearch();
  const { updateSearch, isPending: isUpdating } = useUpdateSearch();
  const isPending = isCreating || isUpdating;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOrUpdateSearchFormData | UpdateSearchFormData>({
    resolver: zodResolver(
      isEditMode ? updateSearchSchema : createOrUpdateSearchSchema
    ) as Resolver<CreateOrUpdateSearchFormData | UpdateSearchFormData>,
    defaultValues: isEditMode && search
      ? {
          title: search.title || "SEARCH THE TECHNO NETWORK",
          subtitle: search.subtitle || "",
          placeholder: search.placeholder || "",
          buttonText: search.buttonText || "SEARCH",
          isActive: search.isActive ?? true,
        }
      : {
          title: "SEARCH THE TECHNO NETWORK",
          subtitle: "",
          placeholder: "",
          buttonText: "SEARCH",
          isActive: true,
        },
  });

  // Reset form when search changes (switching between create/edit)
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && search) {
        reset({
          title: search.title || "SEARCH THE TECHNO NETWORK",
          subtitle: search.subtitle || "",
          placeholder: search.placeholder || "",
          buttonText: search.buttonText || "SEARCH",
          isActive: search.isActive ?? true,
        });
      } else {
        reset({
          title: "SEARCH THE TECHNO NETWORK",
          subtitle: "",
          placeholder: "",
          buttonText: "SEARCH",
          isActive: true,
        });
      }
      setImageFile(null);
      setImageRemoved(false);
    };

    resetForm();
  }, [open, search, isEditMode, reset]);

  const onSubmit = async (data: CreateOrUpdateSearchFormData | UpdateSearchFormData) => {
    try {
      if (isEditMode && search) {
        // Update mode
        const updatePayload: {
          title?: string;
          subtitle?: string;
          placeholder?: string;
          buttonText?: string;
          isActive?: boolean;
          logoImage?: File;
        } = {};

        if (data.title) updatePayload.title = data.title;
        if (data.subtitle) updatePayload.subtitle = data.subtitle;
        if (data.placeholder) updatePayload.placeholder = data.placeholder;
        if (data.buttonText) updatePayload.buttonText = data.buttonText;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
        if (imageFile) {
          updatePayload.logoImage = imageFile;
        }

        await updateSearch({
          id: search._id,
          payload: updatePayload,
        });
      } else {
        // Create mode
        const createPayload = {
          title: (data as CreateOrUpdateSearchFormData).title,
          subtitle: (data as CreateOrUpdateSearchFormData).subtitle,
          placeholder: (data as CreateOrUpdateSearchFormData).placeholder,
          buttonText: (data as CreateOrUpdateSearchFormData).buttonText,
          isActive: (data as CreateOrUpdateSearchFormData).isActive ?? true,
          logoImage: imageFile || undefined,
        };

        await createOrUpdateSearch(createPayload);
      }
      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error(`Error ${isEditMode ? "updating" : "creating"} search:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && search
        ? {
            title: search.title || "SEARCH THE TECHNO NETWORK",
            subtitle: search.subtitle || "",
            placeholder: search.placeholder || "",
            buttonText: search.buttonText || "SEARCH",
            isActive: search.isActive ?? true,
          }
        : {
            title: "SEARCH THE TECHNO NETWORK",
            subtitle: "",
            placeholder: "",
            buttonText: "SEARCH",
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
            {isEditMode ? "Edit Search Section" : "Add New Search Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the search section information"
              : "Fill in the following information to add a new search section"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Logo Image */}
          <div className="space-y-2">
            <Label htmlFor="logoImage">
              Logo Image
              {isEditMode && (
                <span className="text-muted-foreground text-xs ml-2">
                  (Leave empty if you don&apos;t want to change it)
                </span>
              )}
            </Label>
            <Controller
              name="logoImage"
              control={control}
              render={({ field: { onChange, onBlur } }: { field: { onChange: (value: File | undefined) => void; onBlur: () => void } }) => {
                let displayValue: File | string | null = null;
                if (imageRemoved) {
                  displayValue = null;
                } else if (imageFile) {
                  displayValue = imageFile;
                } else if (isEditMode && search?.logoImage) {
                  displayValue = search.logoImage;
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
                    error={errors.logoImage}
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

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">
              Subtitle {!isEditMode && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="subtitle"
              placeholder="Enter subtitle"
              {...register("subtitle")}
              className={cn(errors.subtitle && "border-destructive")}
              rows={4}
            />
            {errors.subtitle && (
              <p className="text-sm text-destructive" role="alert">
                {errors.subtitle.message}
              </p>
            )}
          </div>

          {/* Placeholder */}
          <FormField
            label="Placeholder"
            name="placeholder"
            type="text"
            placeholder="Enter placeholder text"
            register={register("placeholder")}
            error={errors.placeholder}
            required={!isEditMode}
          />

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
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Search"
                : "Create Search"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


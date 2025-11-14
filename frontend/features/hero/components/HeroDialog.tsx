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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { ImageUpload } from "@/components/shared/ImageUpload";
import {
  createOrUpdateHeroSchema,
  updateHeroSchema,
  type CreateOrUpdateHeroFormData,
  type UpdateHeroFormData,
} from "../schemas/hero.schema";
import { useCreateOrUpdateHero } from "../hooks/useCreateOrUpdateHero";
import { useUpdateHero } from "../hooks/useUpdateHero";
import type { Hero } from "../services/heroService";
import { cn } from "@/lib/utils";

interface HeroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hero?: Hero | null;
}

export function HeroDialog({ open, onOpenChange, hero }: HeroDialogProps) {
  const isEditMode = !!hero;
  const { createOrUpdateHero, isPending: isCreating } = useCreateOrUpdateHero();
  const { updateHero, isPending: isUpdating } = useUpdateHero();
  const isPending = isCreating || isUpdating;
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOrUpdateHeroFormData | UpdateHeroFormData>({
    resolver: zodResolver(
      isEditMode ? updateHeroSchema : createOrUpdateHeroSchema
    ) as Resolver<CreateOrUpdateHeroFormData | UpdateHeroFormData>,
    defaultValues: isEditMode && hero
      ? {
          headline: hero.headline || "",
          subtitle: hero.subtitle || "",
          buttonText: hero.buttonText || "EXPLORE",
          buttonAction: hero.buttonAction || "",
          isActive: hero.isActive ?? true,
        }
      : {
          headline: "",
          subtitle: "",
          buttonText: "EXPLORE",
          buttonAction: "",
          isActive: true,
        },
  });

  // Reset form when hero changes (switching between create/edit)
  useEffect(() => {
    if (open) {
      if (isEditMode && hero) {
        reset({
          headline: hero.headline || "",
          subtitle: hero.subtitle || "",
          buttonText: hero.buttonText || "EXPLORE",
          buttonAction: hero.buttonAction || "",
          isActive: hero.isActive ?? true,
        });
        setImageFile(null);
      } else {
        reset({
          headline: "",
          subtitle: "",
          buttonText: "EXPLORE",
          buttonAction: "",
          isActive: true,
        });
        setImageFile(null);
      }
    }
  }, [open, hero, isEditMode, reset]);

  const onSubmit = async (data: CreateOrUpdateHeroFormData | UpdateHeroFormData) => {
    try {
      if (isEditMode && hero) {
        // Update mode
        const updatePayload: {
          headline?: string;
          subtitle?: string;
          buttonText?: string;
          buttonAction?: string;
          isActive?: boolean;
          backgroundImage?: File;
        } = {};

        if (data.headline) updatePayload.headline = data.headline;
        if (data.subtitle) updatePayload.subtitle = data.subtitle;
        if (data.buttonText) updatePayload.buttonText = data.buttonText;
        if (data.buttonAction) updatePayload.buttonAction = data.buttonAction;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
        if (imageFile) updatePayload.backgroundImage = imageFile;

        await updateHero({
          id: hero._id,
          payload: updatePayload,
        });
      } else {
        // Create mode
        if (!imageFile) {
          return; // Image is required for create
        }

        const createPayload = {
          headline: (data as CreateOrUpdateHeroFormData).headline,
          subtitle: (data as CreateOrUpdateHeroFormData).subtitle,
          buttonText: (data as CreateOrUpdateHeroFormData).buttonText,
          buttonAction: (data as CreateOrUpdateHeroFormData).buttonAction,
          isActive: (data as CreateOrUpdateHeroFormData).isActive ?? true,
          backgroundImage: imageFile,
        };

        await createOrUpdateHero(createPayload);
      }
      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error(`Error ${isEditMode ? "updating" : "creating"} hero:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && hero
        ? {
            headline: hero.headline || "",
            subtitle: hero.subtitle || "",
            buttonText: hero.buttonText || "EXPLORE",
            buttonAction: hero.buttonAction || "",
            isActive: hero.isActive ?? true,
          }
        : {
            headline: "",
            subtitle: "",
            buttonText: "EXPLORE",
            buttonAction: "",
            isActive: true,
          }
    );
    setImageFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Hero Section" : "Add New Hero Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the hero section information"
              : "Fill in the following information to add a new hero section"}
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
              render={({ field: { onChange, onBlur } }) => (
                <ImageUpload
                  value={imageFile || hero?.backgroundImage || null}
                  onChange={(file) => {
                    setImageFile(file);
                    onChange(file || undefined);
                  }}
                  onBlur={onBlur}
                  error={errors.backgroundImage}
                  disabled={isPending}
                />
              )}
            />
          </div>

          {/* Headline */}
          <FormField
            label="Headline"
            name="headline"
            type="text"
            placeholder="Enter headline"
            register={register("headline")}
            error={errors.headline}
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

          {/* Is Active */}
          <div className="flex items-center space-x-2">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
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


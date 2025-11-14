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
import { FileUpload } from "@/components/shared/FileUpload";
import {
  createOrUpdateAboutPageContentSchema,
  updateAboutPageContentSchema,
  type CreateOrUpdateAboutPageContentFormData,
  type UpdateAboutPageContentFormData,
} from "../schemas/aboutPageContent.schema";
import { useCreateOrUpdateAboutPageContent } from "../hooks/useCreateOrUpdateAboutPageContent";
import { useUpdateAboutPageContent } from "../hooks/useUpdateAboutPageContent";
import type { AboutPageContent } from "../services/aboutPageContentService";
import { cn } from "@/lib/utils";

interface AboutPageContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aboutPageContent?: AboutPageContent | null;
}

export function AboutPageContentDialog({ open, onOpenChange, aboutPageContent }: AboutPageContentDialogProps) {
  const isEditMode = !!aboutPageContent;
  const { createOrUpdateAboutPageContent, isPending: isCreating } = useCreateOrUpdateAboutPageContent();
  const { updateAboutPageContent, isPending: isUpdating } = useUpdateAboutPageContent();
  const isPending = isCreating || isUpdating;
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [backgroundImageRemoved, setBackgroundImageRemoved] = useState(false);
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
  const [logoImageRemoved, setLogoImageRemoved] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profileFileRemoved, setProfileFileRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOrUpdateAboutPageContentFormData | UpdateAboutPageContentFormData>({
    resolver: zodResolver(
      isEditMode ? updateAboutPageContentSchema : createOrUpdateAboutPageContentSchema
    ) as Resolver<CreateOrUpdateAboutPageContentFormData | UpdateAboutPageContentFormData>,
    defaultValues: isEditMode && aboutPageContent
      ? {
          headline: aboutPageContent.headline || "",
          description: aboutPageContent.description || "",
          secondDescription: aboutPageContent.secondDescription || "",
          buttonText: aboutPageContent.buttonText || "DOWNLOAD COMPANY PROFILE",
          buttonAction: aboutPageContent.buttonAction || "",
          isActive: aboutPageContent.isActive ?? true,
        }
      : {
          headline: "",
          description: "",
          secondDescription: "",
          buttonText: "DOWNLOAD COMPANY PROFILE",
          buttonAction: "",
          isActive: true,
        },
  });

  // Reset form when aboutPageContent changes
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && aboutPageContent) {
        reset({
          headline: aboutPageContent.headline || "",
          description: aboutPageContent.description || "",
          secondDescription: aboutPageContent.secondDescription || "",
          buttonText: aboutPageContent.buttonText || "DOWNLOAD COMPANY PROFILE",
          buttonAction: aboutPageContent.buttonAction || "",
          isActive: aboutPageContent.isActive ?? true,
        });
      } else {
        reset({
          headline: "",
          description: "",
          secondDescription: "",
          buttonText: "DOWNLOAD COMPANY PROFILE",
          buttonAction: "",
          isActive: true,
        });
      }
      setBackgroundImageFile(null);
      setBackgroundImageRemoved(false);
      setLogoImageFile(null);
      setLogoImageRemoved(false);
      setProfileFile(null);
      setProfileFileRemoved(false);
    };

    resetForm();
  }, [open, aboutPageContent, isEditMode, reset]);

  const onSubmit = async (data: CreateOrUpdateAboutPageContentFormData | UpdateAboutPageContentFormData) => {
    try {
      if (isEditMode && aboutPageContent) {
        // Update mode
        const updatePayload: {
          headline?: string;
          description?: string;
          secondDescription?: string;
          buttonText?: string;
          buttonAction?: string;
          isActive?: boolean;
          backgroundImage?: File;
          logoImage?: File;
          companyProfileFile?: File;
        } = {};

        if (data.headline) updatePayload.headline = data.headline;
        if (data.description) updatePayload.description = data.description;
        if (data.secondDescription) updatePayload.secondDescription = data.secondDescription;
        if (data.buttonText) updatePayload.buttonText = data.buttonText;
        if (data.buttonAction !== undefined) updatePayload.buttonAction = data.buttonAction;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
        
        if (backgroundImageFile) {
          updatePayload.backgroundImage = backgroundImageFile;
        }
        if (logoImageFile) {
          updatePayload.logoImage = logoImageFile;
        }
        if (profileFile) {
          updatePayload.companyProfileFile = profileFile;
        }

        await updateAboutPageContent({
          id: aboutPageContent._id,
          payload: updatePayload,
        });
      } else {
        // Create mode
        if (!backgroundImageFile) {
          return; // Background image is required for create
        }

        const createPayload = {
          headline: (data as CreateOrUpdateAboutPageContentFormData).headline,
          description: (data as CreateOrUpdateAboutPageContentFormData).description,
          secondDescription: (data as CreateOrUpdateAboutPageContentFormData).secondDescription,
          buttonText: (data as CreateOrUpdateAboutPageContentFormData).buttonText,
          buttonAction: (data as CreateOrUpdateAboutPageContentFormData).buttonAction,
          isActive: (data as CreateOrUpdateAboutPageContentFormData).isActive ?? true,
          backgroundImage: backgroundImageFile,
          logoImage: logoImageFile || undefined,
          companyProfileFile: profileFile || undefined,
        };

        await createOrUpdateAboutPageContent(createPayload);
      }
      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error(`Error ${isEditMode ? "updating" : "creating"} about page content:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && aboutPageContent
        ? {
            headline: aboutPageContent.headline || "",
            description: aboutPageContent.description || "",
            secondDescription: aboutPageContent.secondDescription || "",
            buttonText: aboutPageContent.buttonText || "DOWNLOAD COMPANY PROFILE",
            buttonAction: aboutPageContent.buttonAction || "",
            isActive: aboutPageContent.isActive ?? true,
          }
        : {
            headline: "",
            description: "",
            secondDescription: "",
            buttonText: "DOWNLOAD COMPANY PROFILE",
            buttonAction: "",
            isActive: true,
          }
    );
    setBackgroundImageFile(null);
    setBackgroundImageRemoved(false);
    setLogoImageFile(null);
    setLogoImageRemoved(false);
    setProfileFile(null);
    setProfileFileRemoved(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit About Page Content" : "Add New About Page Content"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the about page content information"
              : "Fill in the following information to add a new about page content"}
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
                if (backgroundImageRemoved) {
                  displayValue = null;
                } else if (backgroundImageFile) {
                  displayValue = backgroundImageFile;
                } else if (isEditMode && aboutPageContent?.backgroundImage) {
                  displayValue = aboutPageContent.backgroundImage;
                }

                return (
                  <ImageUpload
                    value={displayValue}
                    onChange={(file) => {
                      if (file === null) {
                        setBackgroundImageFile(null);
                        setBackgroundImageRemoved(true);
                        onChange(undefined);
                      } else {
                        setBackgroundImageFile(file);
                        setBackgroundImageRemoved(false);
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

          {/* Logo Image */}
          <div className="space-y-2">
            <Label htmlFor="logoImage">
              Logo Image (Optional)
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
                if (logoImageRemoved) {
                  displayValue = null;
                } else if (logoImageFile) {
                  displayValue = logoImageFile;
                } else if (isEditMode && aboutPageContent?.logoImage) {
                  displayValue = aboutPageContent.logoImage;
                }

                return (
                  <ImageUpload
                    value={displayValue}
                    onChange={(file) => {
                      if (file === null) {
                        setLogoImageFile(null);
                        setLogoImageRemoved(true);
                        onChange(undefined);
                      } else {
                        setLogoImageFile(file);
                        setLogoImageRemoved(false);
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

          {/* Second Description */}
          <div className="space-y-2">
            <Label htmlFor="secondDescription">
              Second Description {!isEditMode && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="secondDescription"
              placeholder="Enter second description"
              {...register("secondDescription")}
              className={cn(errors.secondDescription && "border-destructive")}
              rows={4}
            />
            {errors.secondDescription && (
              <p className="text-sm text-destructive" role="alert">
                {errors.secondDescription.message}
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
            label="Button Action (Optional)"
            name="buttonAction"
            type="text"
            placeholder="Enter button action URL or path"
            register={register("buttonAction")}
            error={errors.buttonAction}
          />

          {/* Company Profile File */}
          <div className="space-y-2">
            <Label htmlFor="companyProfileFile">
              Company Profile File (PDF, Optional)
              {isEditMode && (
                <span className="text-muted-foreground text-xs ml-2">
                  (Leave empty if you don&apos;t want to change it)
                </span>
              )}
            </Label>
            <Controller
              name="companyProfileFile"
              control={control}
              render={({ field: { onChange, onBlur } }: { field: { onChange: (value: File | undefined) => void; onBlur: () => void } }) => {
                let displayValue: File | string | null = null;
                if (profileFileRemoved) {
                  displayValue = null;
                } else if (profileFile) {
                  displayValue = profileFile;
                } else if (isEditMode && aboutPageContent?.companyProfileFile) {
                  displayValue = aboutPageContent.companyProfileFile;
                }

                return (
                  <FileUpload
                    value={displayValue}
                    onChange={(file) => {
                      if (file === null) {
                        setProfileFile(null);
                        setProfileFileRemoved(true);
                        onChange(undefined);
                      } else {
                        setProfileFile(file);
                        setProfileFileRemoved(false);
                        onChange(file);
                      }
                    }}
                    onBlur={onBlur}
                    error={errors.companyProfileFile}
                    disabled={isPending}
                  />
                );
              }}
            />
          </div>

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
            <Button type="submit" disabled={isPending || (!isEditMode && !backgroundImageFile)}>
              {isPending
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Content"
                : "Create Content"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


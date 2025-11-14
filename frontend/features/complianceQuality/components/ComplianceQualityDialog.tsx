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
  createOrUpdateComplianceQualitySchema,
  updateComplianceQualitySchema,
  type CreateOrUpdateComplianceQualityFormData,
  type UpdateComplianceQualityFormData,
} from "../schemas/complianceQuality.schema";
import { useCreateOrUpdateComplianceQuality } from "../hooks/useCreateOrUpdateComplianceQuality";
import { useUpdateComplianceQuality } from "../hooks/useUpdateComplianceQuality";
import type { ComplianceQuality } from "../services/complianceQualityService";
import { cn } from "@/lib/utils";

interface ComplianceQualityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complianceQuality?: ComplianceQuality | null;
}

export function ComplianceQualityDialog({ open, onOpenChange, complianceQuality }: ComplianceQualityDialogProps) {
  const isEditMode = !!complianceQuality;
  const { createOrUpdateComplianceQuality, isPending: isCreating } = useCreateOrUpdateComplianceQuality();
  const { updateComplianceQuality, isPending: isUpdating } = useUpdateComplianceQuality();
  const isPending = isCreating || isUpdating;
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
  const [logoImageRemoved, setLogoImageRemoved] = useState(false);
  const [displayImageFile, setDisplayImageFile] = useState<File | null>(null);
  const [displayImageRemoved, setDisplayImageRemoved] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profileFileRemoved, setProfileFileRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOrUpdateComplianceQualityFormData | UpdateComplianceQualityFormData>({
    resolver: zodResolver(
      isEditMode ? updateComplianceQualitySchema : createOrUpdateComplianceQualitySchema
    ) as Resolver<CreateOrUpdateComplianceQualityFormData | UpdateComplianceQualityFormData>,
    defaultValues: isEditMode && complianceQuality
      ? {
          title: complianceQuality.title || "COMPLIANCE & QUALITY ASSURANCE",
          firstDescription: complianceQuality.firstDescription || "",
          secondDescription: complianceQuality.secondDescription || "",
          buttonText: complianceQuality.buttonText || "DOWNLOAD COMPANY PROFILE",
          buttonAction: complianceQuality.buttonAction || "",
          isActive: complianceQuality.isActive ?? true,
        }
      : {
          title: "COMPLIANCE & QUALITY ASSURANCE",
          firstDescription: "",
          secondDescription: "",
          buttonText: "DOWNLOAD COMPANY PROFILE",
          buttonAction: "",
          isActive: true,
        },
  });

  // Reset form when complianceQuality changes
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && complianceQuality) {
        reset({
          title: complianceQuality.title || "COMPLIANCE & QUALITY ASSURANCE",
          firstDescription: complianceQuality.firstDescription || "",
          secondDescription: complianceQuality.secondDescription || "",
          buttonText: complianceQuality.buttonText || "DOWNLOAD COMPANY PROFILE",
          buttonAction: complianceQuality.buttonAction || "",
          isActive: complianceQuality.isActive ?? true,
        });
      } else {
        reset({
          title: "COMPLIANCE & QUALITY ASSURANCE",
          firstDescription: "",
          secondDescription: "",
          buttonText: "DOWNLOAD COMPANY PROFILE",
          buttonAction: "",
          isActive: true,
        });
      }
      setLogoImageFile(null);
      setLogoImageRemoved(false);
      setDisplayImageFile(null);
      setDisplayImageRemoved(false);
      setProfileFile(null);
      setProfileFileRemoved(false);
    };

    resetForm();
  }, [open, complianceQuality, isEditMode, reset]);

  const onSubmit = async (data: CreateOrUpdateComplianceQualityFormData | UpdateComplianceQualityFormData) => {
    try {
      if (isEditMode && complianceQuality) {
        const updatePayload: {
          title?: string;
          firstDescription?: string;
          secondDescription?: string;
          buttonText?: string;
          buttonAction?: string;
          isActive?: boolean;
          logoImage?: File;
          displayImage?: File;
          companyProfileFile?: File;
        } = {};

        if (data.title) updatePayload.title = data.title;
        if (data.firstDescription) updatePayload.firstDescription = data.firstDescription;
        if (data.secondDescription) updatePayload.secondDescription = data.secondDescription;
        if (data.buttonText) updatePayload.buttonText = data.buttonText;
        if (data.buttonAction !== undefined) updatePayload.buttonAction = data.buttonAction;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
        
        if (logoImageFile) {
          updatePayload.logoImage = logoImageFile;
        }
        if (displayImageFile) {
          updatePayload.displayImage = displayImageFile;
        }
        if (profileFile) {
          updatePayload.companyProfileFile = profileFile;
        }

        await updateComplianceQuality({
          id: complianceQuality._id,
          payload: updatePayload,
        });
      } else {
        const createPayload = {
          title: (data as CreateOrUpdateComplianceQualityFormData).title,
          firstDescription: (data as CreateOrUpdateComplianceQualityFormData).firstDescription,
          secondDescription: (data as CreateOrUpdateComplianceQualityFormData).secondDescription,
          buttonText: (data as CreateOrUpdateComplianceQualityFormData).buttonText,
          buttonAction: (data as CreateOrUpdateComplianceQualityFormData).buttonAction,
          isActive: (data as CreateOrUpdateComplianceQualityFormData).isActive ?? true,
          logoImage: logoImageFile || undefined,
          displayImage: displayImageFile || undefined,
          companyProfileFile: profileFile || undefined,
        };

        await createOrUpdateComplianceQuality(createPayload);
      }
      handleClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} compliance & quality section:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && complianceQuality
        ? {
            title: complianceQuality.title || "COMPLIANCE & QUALITY ASSURANCE",
            firstDescription: complianceQuality.firstDescription || "",
            secondDescription: complianceQuality.secondDescription || "",
            buttonText: complianceQuality.buttonText || "DOWNLOAD COMPANY PROFILE",
            buttonAction: complianceQuality.buttonAction || "",
            isActive: complianceQuality.isActive ?? true,
          }
        : {
            title: "COMPLIANCE & QUALITY ASSURANCE",
            firstDescription: "",
            secondDescription: "",
            buttonText: "DOWNLOAD COMPANY PROFILE",
            buttonAction: "",
            isActive: true,
          }
    );
    setLogoImageFile(null);
    setLogoImageRemoved(false);
    setDisplayImageFile(null);
    setDisplayImageRemoved(false);
    setProfileFile(null);
    setProfileFileRemoved(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Compliance & Quality Section" : "Add New Compliance & Quality Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the compliance & quality section information"
              : "Fill in the following information to add a new compliance & quality section"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              render={({ field: { onChange, onBlur } }) => {
                let displayValue: File | string | null = null;
                if (logoImageRemoved) {
                  displayValue = null;
                } else if (logoImageFile) {
                  displayValue = logoImageFile;
                } else if (isEditMode && complianceQuality?.logoImage) {
                  displayValue = complianceQuality.logoImage;
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

          {/* First Description */}
          <div className="space-y-2">
            <Label htmlFor="firstDescription">
              First Description {!isEditMode && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="firstDescription"
              placeholder="Enter first description"
              {...register("firstDescription")}
              className={cn(errors.firstDescription && "border-destructive")}
              rows={4}
            />
            {errors.firstDescription && (
              <p className="text-sm text-destructive" role="alert">
                {errors.firstDescription.message}
              </p>
            )}
          </div>

          {/* Display Image */}
          <div className="space-y-2">
            <Label htmlFor="displayImage">
              Display Image (Optional)
              {isEditMode && (
                <span className="text-muted-foreground text-xs ml-2">
                  (Leave empty if you don&apos;t want to change it)
                </span>
              )}
            </Label>
            <Controller
              name="displayImage"
              control={control}
              render={({ field: { onChange, onBlur } }) => {
                let displayValue: File | string | null = null;
                if (displayImageRemoved) {
                  displayValue = null;
                } else if (displayImageFile) {
                  displayValue = displayImageFile;
                } else if (isEditMode && complianceQuality?.displayImage) {
                  displayValue = complianceQuality.displayImage;
                }

                return (
                  <ImageUpload
                    value={displayValue}
                    onChange={(file) => {
                      if (file === null) {
                        setDisplayImageFile(null);
                        setDisplayImageRemoved(true);
                        onChange(undefined);
                      } else {
                        setDisplayImageFile(file);
                        setDisplayImageRemoved(false);
                        onChange(file);
                      }
                    }}
                    onBlur={onBlur}
                    error={errors.displayImage}
                    disabled={isPending}
                  />
                );
              }}
            />
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
            placeholder="Enter button action URL"
            register={register("buttonAction")}
            error={errors.buttonAction}
          />

          {/* Company Profile File */}
          <div className="space-y-2">
            <Label htmlFor="companyProfileFile">
              Company Profile File (PDF) (Optional)
              {isEditMode && (
                <span className="text-muted-foreground text-xs ml-2">
                  (Leave empty if you don&apos;t want to change it)
                </span>
              )}
            </Label>
            <Controller
              name="companyProfileFile"
              control={control}
              render={({ field: { onChange, onBlur } }) => {
                let displayValue: File | string | null = null;
                if (profileFileRemoved) {
                  displayValue = null;
                } else if (profileFile) {
                  displayValue = profileFile;
                } else if (isEditMode && complianceQuality?.companyProfileFile) {
                  displayValue = complianceQuality.companyProfileFile;
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
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Section"
                : "Create Section"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


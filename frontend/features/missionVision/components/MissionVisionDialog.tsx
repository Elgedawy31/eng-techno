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
  createOrUpdateMissionVisionSchema,
  updateMissionVisionSchema,
  type CreateOrUpdateMissionVisionFormData,
  type UpdateMissionVisionFormData,
} from "../schemas/missionVision.schema";
import { useCreateOrUpdateMissionVision } from "../hooks/useCreateOrUpdateMissionVision";
import { useUpdateMissionVision } from "../hooks/useUpdateMissionVision";
import type { MissionVision } from "../services/missionVisionService";
import { cn } from "@/lib/utils";

interface MissionVisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missionVision?: MissionVision | null;
}

export function MissionVisionDialog({ open, onOpenChange, missionVision }: MissionVisionDialogProps) {
  const isEditMode = !!missionVision;
  const { createOrUpdateMissionVision, isPending: isCreating } = useCreateOrUpdateMissionVision();
  const { updateMissionVision, isPending: isUpdating } = useUpdateMissionVision();
  const isPending = isCreating || isUpdating;
  
  const [missionLogoFile, setMissionLogoFile] = useState<File | null>(null);
  const [missionLogoRemoved, setMissionLogoRemoved] = useState(false);
  const [missionImageFile, setMissionImageFile] = useState<File | null>(null);
  const [missionImageRemoved, setMissionImageRemoved] = useState(false);
  const [visionLogoFile, setVisionLogoFile] = useState<File | null>(null);
  const [visionLogoRemoved, setVisionLogoRemoved] = useState(false);
  const [visionImageFile, setVisionImageFile] = useState<File | null>(null);
  const [visionImageRemoved, setVisionImageRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOrUpdateMissionVisionFormData | UpdateMissionVisionFormData>({
    resolver: zodResolver(
      isEditMode ? updateMissionVisionSchema : createOrUpdateMissionVisionSchema
    ) as Resolver<CreateOrUpdateMissionVisionFormData | UpdateMissionVisionFormData>,
    defaultValues: isEditMode && missionVision
      ? {
          missionTitle: missionVision.missionTitle || "OUR MISSION",
          missionDescription: missionVision.missionDescription || "",
          visionTitle: missionVision.visionTitle || "OUR VISION",
          visionDescription: missionVision.visionDescription || "",
          isActive: missionVision.isActive ?? true,
        }
      : {
          missionTitle: "OUR MISSION",
          missionDescription: "",
          visionTitle: "OUR VISION",
          visionDescription: "",
          isActive: true,
        },
  });

  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && missionVision) {
        reset({
          missionTitle: missionVision.missionTitle || "OUR MISSION",
          missionDescription: missionVision.missionDescription || "",
          visionTitle: missionVision.visionTitle || "OUR VISION",
          visionDescription: missionVision.visionDescription || "",
          isActive: missionVision.isActive ?? true,
        });
      } else {
        reset({
          missionTitle: "OUR MISSION",
          missionDescription: "",
          visionTitle: "OUR VISION",
          visionDescription: "",
          isActive: true,
        });
      }
      setMissionLogoFile(null);
      setMissionLogoRemoved(false);
      setMissionImageFile(null);
      setMissionImageRemoved(false);
      setVisionLogoFile(null);
      setVisionLogoRemoved(false);
      setVisionImageFile(null);
      setVisionImageRemoved(false);
    };

    resetForm();
  }, [open, missionVision, isEditMode, reset]);

  const onSubmit = async (data: CreateOrUpdateMissionVisionFormData | UpdateMissionVisionFormData) => {
    try {
      if (isEditMode && missionVision) {
        const updatePayload: {
          missionTitle?: string;
          missionDescription?: string;
          visionTitle?: string;
          visionDescription?: string;
          isActive?: boolean;
          missionLogoImage?: File;
          missionImage?: File;
          visionLogoImage?: File;
          visionImage?: File;
        } = {};

        if (data.missionTitle) updatePayload.missionTitle = data.missionTitle;
        if (data.missionDescription) updatePayload.missionDescription = data.missionDescription;
        if (data.visionTitle) updatePayload.visionTitle = data.visionTitle;
        if (data.visionDescription) updatePayload.visionDescription = data.visionDescription;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
        
        if (missionLogoFile) updatePayload.missionLogoImage = missionLogoFile;
        if (missionImageFile) updatePayload.missionImage = missionImageFile;
        if (visionLogoFile) updatePayload.visionLogoImage = visionLogoFile;
        if (visionImageFile) updatePayload.visionImage = visionImageFile;

        await updateMissionVision({
          id: missionVision._id,
          payload: updatePayload,
        });
      } else {
        const createPayload = {
          missionTitle: (data as CreateOrUpdateMissionVisionFormData).missionTitle,
          missionDescription: (data as CreateOrUpdateMissionVisionFormData).missionDescription,
          visionTitle: (data as CreateOrUpdateMissionVisionFormData).visionTitle,
          visionDescription: (data as CreateOrUpdateMissionVisionFormData).visionDescription,
          isActive: (data as CreateOrUpdateMissionVisionFormData).isActive ?? true,
          missionLogoImage: missionLogoFile || undefined,
          missionImage: missionImageFile || undefined,
          visionLogoImage: visionLogoFile || undefined,
          visionImage: visionImageFile || undefined,
        };

        await createOrUpdateMissionVision(createPayload);
      }
      handleClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} mission & vision:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && missionVision
        ? {
            missionTitle: missionVision.missionTitle || "OUR MISSION",
            missionDescription: missionVision.missionDescription || "",
            visionTitle: missionVision.visionTitle || "OUR VISION",
            visionDescription: missionVision.visionDescription || "",
            isActive: missionVision.isActive ?? true,
          }
        : {
            missionTitle: "OUR MISSION",
            missionDescription: "",
            visionTitle: "OUR VISION",
            visionDescription: "",
            isActive: true,
          }
    );
    setMissionLogoFile(null);
    setMissionLogoRemoved(false);
    setMissionImageFile(null);
    setMissionImageRemoved(false);
    setVisionLogoFile(null);
    setVisionLogoRemoved(false);
    setVisionImageFile(null);
    setVisionImageRemoved(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Mission & Vision" : "Add New Mission & Vision"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the mission & vision information"
              : "Fill in the following information to add a new mission & vision"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Mission Section */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold">Mission</h3>
            
            {/* Mission Logo Image */}
            <div className="space-y-2">
              <Label htmlFor="missionLogoImage">
                Mission Logo Image (Optional)
                {isEditMode && (
                  <span className="text-muted-foreground text-xs ml-2">
                    (Leave empty if you don&apos;t want to change it)
                  </span>
                )}
              </Label>
              <Controller
                name="missionLogoImage"
                control={control}
                render={({ field: { onChange, onBlur } }) => {
                  let displayValue: File | string | null = null;
                  if (missionLogoRemoved) {
                    displayValue = null;
                  } else if (missionLogoFile) {
                    displayValue = missionLogoFile;
                  } else if (isEditMode && missionVision?.missionLogoImage) {
                    displayValue = missionVision.missionLogoImage;
                  }

                  return (
                    <ImageUpload
                      value={displayValue}
                      onChange={(file) => {
                        if (file === null) {
                          setMissionLogoFile(null);
                          setMissionLogoRemoved(true);
                          onChange(undefined);
                        } else {
                          setMissionLogoFile(file);
                          setMissionLogoRemoved(false);
                          onChange(file);
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.missionLogoImage}
                      disabled={isPending}
                    />
                  );
                }}
              />
            </div>

            {/* Mission Image */}
            <div className="space-y-2">
              <Label htmlFor="missionImage">
                Mission Image (Optional)
                {isEditMode && (
                  <span className="text-muted-foreground text-xs ml-2">
                    (Leave empty if you don&apos;t want to change it)
                  </span>
                )}
              </Label>
              <Controller
                name="missionImage"
                control={control}
                render={({ field: { onChange, onBlur } }) => {
                  let displayValue: File | string | null = null;
                  if (missionImageRemoved) {
                    displayValue = null;
                  } else if (missionImageFile) {
                    displayValue = missionImageFile;
                  } else if (isEditMode && missionVision?.missionImage) {
                    displayValue = missionVision.missionImage;
                  }

                  return (
                    <ImageUpload
                      value={displayValue}
                      onChange={(file) => {
                        if (file === null) {
                          setMissionImageFile(null);
                          setMissionImageRemoved(true);
                          onChange(undefined);
                        } else {
                          setMissionImageFile(file);
                          setMissionImageRemoved(false);
                          onChange(file);
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.missionImage}
                      disabled={isPending}
                    />
                  );
                }}
              />
            </div>

            {/* Mission Title */}
            <FormField
              label="Mission Title"
              name="missionTitle"
              type="text"
              placeholder="Enter mission title"
              register={register("missionTitle")}
              error={errors.missionTitle}
              required={!isEditMode}
            />

            {/* Mission Description */}
            <div className="space-y-2">
              <Label htmlFor="missionDescription">
                Mission Description {!isEditMode && <span className="text-destructive">*</span>}
              </Label>
              <Textarea
                id="missionDescription"
                placeholder="Enter mission description"
                {...register("missionDescription")}
                className={cn(errors.missionDescription && "border-destructive")}
                rows={4}
              />
              {errors.missionDescription && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.missionDescription.message}
                </p>
              )}
            </div>
          </div>

          {/* Vision Section */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold">Vision</h3>
            
            {/* Vision Logo Image */}
            <div className="space-y-2">
              <Label htmlFor="visionLogoImage">
                Vision Logo Image (Optional)
                {isEditMode && (
                  <span className="text-muted-foreground text-xs ml-2">
                    (Leave empty if you don&apos;t want to change it)
                  </span>
                )}
              </Label>
              <Controller
                name="visionLogoImage"
                control={control}
                render={({ field: { onChange, onBlur } }) => {
                  let displayValue: File | string | null = null;
                  if (visionLogoRemoved) {
                    displayValue = null;
                  } else if (visionLogoFile) {
                    displayValue = visionLogoFile;
                  } else if (isEditMode && missionVision?.visionLogoImage) {
                    displayValue = missionVision.visionLogoImage;
                  }

                  return (
                    <ImageUpload
                      value={displayValue}
                      onChange={(file) => {
                        if (file === null) {
                          setVisionLogoFile(null);
                          setVisionLogoRemoved(true);
                          onChange(undefined);
                        } else {
                          setVisionLogoFile(file);
                          setVisionLogoRemoved(false);
                          onChange(file);
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.visionLogoImage}
                      disabled={isPending}
                    />
                  );
                }}
              />
            </div>

            {/* Vision Image */}
            <div className="space-y-2">
              <Label htmlFor="visionImage">
                Vision Image (Optional)
                {isEditMode && (
                  <span className="text-muted-foreground text-xs ml-2">
                    (Leave empty if you don&apos;t want to change it)
                  </span>
                )}
              </Label>
              <Controller
                name="visionImage"
                control={control}
                render={({ field: { onChange, onBlur } }) => {
                  let displayValue: File | string | null = null;
                  if (visionImageRemoved) {
                    displayValue = null;
                  } else if (visionImageFile) {
                    displayValue = visionImageFile;
                  } else if (isEditMode && missionVision?.visionImage) {
                    displayValue = missionVision.visionImage;
                  }

                  return (
                    <ImageUpload
                      value={displayValue}
                      onChange={(file) => {
                        if (file === null) {
                          setVisionImageFile(null);
                          setVisionImageRemoved(true);
                          onChange(undefined);
                        } else {
                          setVisionImageFile(file);
                          setVisionImageRemoved(false);
                          onChange(file);
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.visionImage}
                      disabled={isPending}
                    />
                  );
                }}
              />
            </div>

            {/* Vision Title */}
            <FormField
              label="Vision Title"
              name="visionTitle"
              type="text"
              placeholder="Enter vision title"
              register={register("visionTitle")}
              error={errors.visionTitle}
              required={!isEditMode}
            />

            {/* Vision Description */}
            <div className="space-y-2">
              <Label htmlFor="visionDescription">
                Vision Description {!isEditMode && <span className="text-destructive">*</span>}
              </Label>
              <Textarea
                id="visionDescription"
                placeholder="Enter vision description"
                {...register("visionDescription")}
                className={cn(errors.visionDescription && "border-destructive")}
                rows={4}
              />
              {errors.visionDescription && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.visionDescription.message}
                </p>
              )}
            </div>
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
                ? "Update Mission & Vision"
                : "Create Mission & Vision"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


"use client";

import { useEffect } from "react";
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
import {
  createOrUpdateMediaCentreSchema,
  updateMediaCentreSchema,
  type CreateOrUpdateMediaCentreFormData,
  type UpdateMediaCentreFormData,
} from "../schemas/mediaCentre.schema";
import { useCreateOrUpdateMediaCentre } from "../hooks/useCreateOrUpdateMediaCentre";
import { useUpdateMediaCentre } from "../hooks/useUpdateMediaCentre";
import type { MediaCentre } from "../services/mediaCentreService";
import { cn } from "@/lib/utils";

interface MediaCentreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaCentre?: MediaCentre | null;
}

export function MediaCentreDialog({ open, onOpenChange, mediaCentre }: MediaCentreDialogProps) {
  const isEditMode = !!mediaCentre;
  const { createOrUpdateMediaCentre, isPending: isCreating } = useCreateOrUpdateMediaCentre();
  const { updateMediaCentre, isPending: isUpdating } = useUpdateMediaCentre();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOrUpdateMediaCentreFormData | UpdateMediaCentreFormData>({
    resolver: zodResolver(
      isEditMode ? updateMediaCentreSchema : createOrUpdateMediaCentreSchema
    ) as Resolver<CreateOrUpdateMediaCentreFormData | UpdateMediaCentreFormData>,
    defaultValues: isEditMode && mediaCentre
      ? {
          mainTitle: mediaCentre.mainTitle || "MEDIA CENTRE / INDUSTRY EVENTS",
          mainDescription: mediaCentre.mainDescription || "",
          isActive: mediaCentre.isActive ?? true,
        }
      : {
          mainTitle: "MEDIA CENTRE / INDUSTRY EVENTS",
          mainDescription: "",
          isActive: true,
        },
  });

  // Reset form when mediaCentre changes (switching between create/edit)
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && mediaCentre) {
        reset({
          mainTitle: mediaCentre.mainTitle || "MEDIA CENTRE / INDUSTRY EVENTS",
          mainDescription: mediaCentre.mainDescription || "",
          isActive: mediaCentre.isActive ?? true,
        });
      } else {
        reset({
          mainTitle: "MEDIA CENTRE / INDUSTRY EVENTS",
          mainDescription: "",
          isActive: true,
        });
      }
    };

    resetForm();
  }, [open, mediaCentre, isEditMode, reset]);

  const onSubmit = async (data: CreateOrUpdateMediaCentreFormData | UpdateMediaCentreFormData) => {
    try {
      if (isEditMode && mediaCentre) {
        // Update mode
        const updatePayload: {
          mainTitle?: string;
          mainDescription?: string;
          isActive?: boolean;
        } = {};

        if (data.mainTitle) updatePayload.mainTitle = data.mainTitle;
        if (data.mainDescription) updatePayload.mainDescription = data.mainDescription;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

        await updateMediaCentre({
          id: mediaCentre._id,
          payload: updatePayload,
        });
      } else {
        // Create mode
        const createPayload = {
          mainTitle: (data as CreateOrUpdateMediaCentreFormData).mainTitle,
          mainDescription: (data as CreateOrUpdateMediaCentreFormData).mainDescription,
          isActive: (data as CreateOrUpdateMediaCentreFormData).isActive ?? true,
        };

        await createOrUpdateMediaCentre(createPayload);
      }
      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error(`Error ${isEditMode ? "updating" : "creating"} media centre:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && mediaCentre
        ? {
            mainTitle: mediaCentre.mainTitle || "MEDIA CENTRE / INDUSTRY EVENTS",
            mainDescription: mediaCentre.mainDescription || "",
            isActive: mediaCentre.isActive ?? true,
          }
        : {
            mainTitle: "MEDIA CENTRE / INDUSTRY EVENTS",
            mainDescription: "",
            isActive: true,
          }
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Media Centre Section" : "Add New Media Centre Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the media centre section information"
              : "Fill in the following information to add a new media centre section"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Title */}
          <FormField
            label="Main Title"
            name="mainTitle"
            type="text"
            placeholder="Enter main title"
            register={register("mainTitle")}
            error={errors.mainTitle}
            required={!isEditMode}
          />

          {/* Main Description */}
          <div className="space-y-2">
            <Label htmlFor="mainDescription">
              Main Description {!isEditMode && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="mainDescription"
              placeholder="Enter main description"
              {...register("mainDescription")}
              className={cn(errors.mainDescription && "border-destructive")}
              rows={6}
            />
            {errors.mainDescription && (
              <p className="text-sm text-destructive" role="alert">
                {errors.mainDescription.message}
              </p>
            )}
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
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Media Centre"
                : "Create Media Centre"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


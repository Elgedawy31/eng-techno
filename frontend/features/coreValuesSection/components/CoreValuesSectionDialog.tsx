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
  createOrUpdateCoreValuesSectionSchema,
  updateCoreValuesSectionSchema,
  type CreateOrUpdateCoreValuesSectionFormData,
  type UpdateCoreValuesSectionFormData,
} from "../schemas/coreValuesSection.schema";
import { useCreateOrUpdateCoreValuesSection } from "../hooks/useCreateOrUpdateCoreValuesSection";
import { useUpdateCoreValuesSection } from "../hooks/useUpdateCoreValuesSection";
import type { CoreValuesSection } from "../services/coreValuesSectionService";
import { cn } from "@/lib/utils";

interface CoreValuesSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coreValuesSection?: CoreValuesSection | null;
}

export function CoreValuesSectionDialog({ open, onOpenChange, coreValuesSection }: CoreValuesSectionDialogProps) {
  const isEditMode = !!coreValuesSection;
  const { createOrUpdateCoreValuesSection, isPending: isCreating } = useCreateOrUpdateCoreValuesSection();
  const { updateCoreValuesSection, isPending: isUpdating } = useUpdateCoreValuesSection();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOrUpdateCoreValuesSectionFormData | UpdateCoreValuesSectionFormData>({
    resolver: zodResolver(
      isEditMode ? updateCoreValuesSectionSchema : createOrUpdateCoreValuesSectionSchema
    ) as Resolver<CreateOrUpdateCoreValuesSectionFormData | UpdateCoreValuesSectionFormData>,
    defaultValues: isEditMode && coreValuesSection
      ? {
          label: coreValuesSection.label || "//CORE VALUES",
          heading: coreValuesSection.heading || "",
          isActive: coreValuesSection.isActive ?? true,
        }
      : {
          label: "//CORE VALUES",
          heading: "",
          isActive: true,
        },
  });

  // Reset form when coreValuesSection changes
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && coreValuesSection) {
        reset({
          label: coreValuesSection.label || "//CORE VALUES",
          heading: coreValuesSection.heading || "",
          isActive: coreValuesSection.isActive ?? true,
        });
      } else {
        reset({
          label: "//CORE VALUES",
          heading: "",
          isActive: true,
        });
      }
    };

    resetForm();
  }, [open, coreValuesSection, isEditMode, reset]);

  const onSubmit = async (data: CreateOrUpdateCoreValuesSectionFormData | UpdateCoreValuesSectionFormData) => {
    try {
      if (isEditMode && coreValuesSection) {
        const updatePayload: {
          label?: string;
          heading?: string;
          isActive?: boolean;
        } = {};

        if (data.label !== undefined) updatePayload.label = data.label;
        if (data.heading) updatePayload.heading = data.heading;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

        await updateCoreValuesSection({
          id: coreValuesSection._id,
          payload: updatePayload,
        });
      } else {
        const createPayload = {
          label: (data as CreateOrUpdateCoreValuesSectionFormData).label,
          heading: (data as CreateOrUpdateCoreValuesSectionFormData).heading,
          isActive: (data as CreateOrUpdateCoreValuesSectionFormData).isActive ?? true,
        };

        await createOrUpdateCoreValuesSection(createPayload);
      }
      handleClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} core values section:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && coreValuesSection
        ? {
            label: coreValuesSection.label || "//CORE VALUES",
            heading: coreValuesSection.heading || "",
            isActive: coreValuesSection.isActive ?? true,
          }
        : {
            label: "//CORE VALUES",
            heading: "",
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
            {isEditMode ? "Edit Core Values Section" : "Add New Core Values Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the core values section information"
              : "Fill in the following information to add a new core values section"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Label */}
          <FormField
            label="Label (Optional)"
            name="label"
            type="text"
            placeholder="Enter label (e.g., //CORE VALUES)"
            register={register("label")}
            error={errors.label}
          />

          {/* Heading */}
          <div className="space-y-2">
            <Label htmlFor="heading">
              Heading {!isEditMode && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="heading"
              placeholder="Enter heading"
              {...register("heading")}
              className={cn(errors.heading && "border-destructive")}
              rows={6}
            />
            {errors.heading && (
              <p className="text-sm text-destructive" role="alert">
                {errors.heading.message}
              </p>
            )}
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


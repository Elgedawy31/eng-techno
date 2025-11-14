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
  createOrUpdateFooterSchema,
  updateFooterSchema,
  type CreateOrUpdateFooterFormData,
  type UpdateFooterFormData,
} from "../schemas/footer.schema";
import { useCreateOrUpdateFooter } from "../hooks/useCreateOrUpdateFooter";
import { useUpdateFooter } from "../hooks/useUpdateFooter";
import type { Footer } from "../services/footerService";

interface FooterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  footer?: Footer | null;
}

export function FooterDialog({ open, onOpenChange, footer }: FooterDialogProps) {
  const isEditMode = !!footer;
  const { createOrUpdateFooter, isPending: isCreating } = useCreateOrUpdateFooter();
  const { updateFooter, isPending: isUpdating } = useUpdateFooter();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOrUpdateFooterFormData | UpdateFooterFormData>({
    resolver: zodResolver(
      isEditMode ? updateFooterSchema : createOrUpdateFooterSchema
    ) as Resolver<CreateOrUpdateFooterFormData | UpdateFooterFormData>,
    defaultValues: isEditMode && footer
      ? {
          mainTitle: footer.mainTitle || "Contact",
          subtitle: footer.subtitle || "LET'S SHAPE THE FUTURE OF DEFENSE TOGETHER.",
          email: footer.email || "",
          phone: footer.phone || "",
          officeLocations: footer.officeLocations || "",
          buttonText: footer.buttonText || "GET IN TOUCH",
          buttonAction: footer.buttonAction || "",
          isActive: footer.isActive ?? true,
        }
      : {
          mainTitle: "Contact",
          subtitle: "LET'S SHAPE THE FUTURE OF DEFENSE TOGETHER.",
          email: "",
          phone: "",
          officeLocations: "",
          buttonText: "GET IN TOUCH",
          buttonAction: "",
          isActive: true,
        },
  });

  // Reset form when footer changes (switching between create/edit)
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && footer) {
        reset({
          mainTitle: footer.mainTitle || "Contact",
          subtitle: footer.subtitle || "LET'S SHAPE THE FUTURE OF DEFENSE TOGETHER.",
          email: footer.email || "",
          phone: footer.phone || "",
          officeLocations: footer.officeLocations || "",
          buttonText: footer.buttonText || "GET IN TOUCH",
          buttonAction: footer.buttonAction || "",
          isActive: footer.isActive ?? true,
        });
      } else {
        reset({
          mainTitle: "Contact",
          subtitle: "LET'S SHAPE THE FUTURE OF DEFENSE TOGETHER.",
          email: "",
          phone: "",
          officeLocations: "",
          buttonText: "GET IN TOUCH",
          buttonAction: "",
          isActive: true,
        });
      }
    };

    resetForm();
  }, [open, footer, isEditMode, reset]);

  const onSubmit = async (data: CreateOrUpdateFooterFormData | UpdateFooterFormData) => {
    try {
      if (isEditMode && footer) {
        // Update mode
        const updatePayload: {
          mainTitle?: string;
          subtitle?: string;
          email?: string;
          phone?: string;
          officeLocations?: string;
          buttonText?: string;
          buttonAction?: string;
          isActive?: boolean;
        } = {};

        if (data.mainTitle) updatePayload.mainTitle = data.mainTitle;
        if (data.subtitle) updatePayload.subtitle = data.subtitle;
        if (data.email) updatePayload.email = data.email;
        if (data.phone) updatePayload.phone = data.phone;
        if (data.officeLocations) updatePayload.officeLocations = data.officeLocations;
        if (data.buttonText) updatePayload.buttonText = data.buttonText;
        if (data.buttonAction !== undefined) updatePayload.buttonAction = data.buttonAction;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

        await updateFooter({
          id: footer._id,
          payload: updatePayload,
        });
      } else {
        // Create or update mode (singleton pattern)
        const createOrUpdatePayload = {
          mainTitle: (data as CreateOrUpdateFooterFormData).mainTitle,
          subtitle: (data as CreateOrUpdateFooterFormData).subtitle,
          email: (data as CreateOrUpdateFooterFormData).email,
          phone: (data as CreateOrUpdateFooterFormData).phone,
          officeLocations: (data as CreateOrUpdateFooterFormData).officeLocations,
          buttonText: (data as CreateOrUpdateFooterFormData).buttonText,
          buttonAction: (data as CreateOrUpdateFooterFormData).buttonAction,
          isActive: (data as CreateOrUpdateFooterFormData).isActive ?? true,
        };

        await createOrUpdateFooter(createOrUpdatePayload);
      }
      handleClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "saving"} footer:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && footer
        ? {
            mainTitle: footer.mainTitle || "Contact",
            subtitle: footer.subtitle || "LET'S SHAPE THE FUTURE OF DEFENSE TOGETHER.",
            email: footer.email || "",
            phone: footer.phone || "",
            officeLocations: footer.officeLocations || "",
            buttonText: footer.buttonText || "GET IN TOUCH",
            buttonAction: footer.buttonAction || "",
            isActive: footer.isActive ?? true,
          }
        : {
            mainTitle: "Contact",
            subtitle: "LET'S SHAPE THE FUTURE OF DEFENSE TOGETHER.",
            email: "",
            phone: "",
            officeLocations: "",
            buttonText: "GET IN TOUCH",
            buttonAction: "",
            isActive: true,
          }
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Footer" : "Create or Update Footer"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the footer information"
              : "Fill in the following information to create or update the footer (only one footer can exist)"}
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

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">
              Subtitle {!isEditMode && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="subtitle"
              placeholder="Enter subtitle"
              {...register("subtitle")}
              className={errors.subtitle ? "border-destructive" : ""}
              rows={3}
            />
            {errors.subtitle && (
              <p className="text-sm text-destructive" role="alert">
                {errors.subtitle.message}
              </p>
            )}
          </div>

          {/* Email */}
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter email address"
            register={register("email")}
            error={errors.email}
            required={!isEditMode}
          />

          {/* Phone */}
          <FormField
            label="Phone"
            name="phone"
            type="text"
            placeholder="Enter phone number"
            register={register("phone")}
            error={errors.phone}
            required={!isEditMode}
          />

          {/* Office Locations */}
          <div className="space-y-2">
            <Label htmlFor="officeLocations">
              Office Locations {!isEditMode && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="officeLocations"
              placeholder="Enter office locations"
              {...register("officeLocations")}
              className={errors.officeLocations ? "border-destructive" : ""}
              rows={4}
            />
            {errors.officeLocations && (
              <p className="text-sm text-destructive" role="alert">
                {errors.officeLocations.message}
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
            placeholder="Enter button action URL or path (optional)"
            register={register("buttonAction")}
            error={errors.buttonAction}
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
                  : "Saving..."
                : isEditMode
                ? "Update Footer"
                : "Save Footer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


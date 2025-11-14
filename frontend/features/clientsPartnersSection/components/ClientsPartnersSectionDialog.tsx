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
  createOrUpdateClientsPartnersSectionSchema,
  updateClientsPartnersSectionSchema,
  type CreateOrUpdateClientsPartnersSectionFormData,
  type UpdateClientsPartnersSectionFormData,
} from "../schemas/clientsPartnersSection.schema";
import { useCreateOrUpdateClientsPartnersSection } from "../hooks/useCreateOrUpdateClientsPartnersSection";
import { useUpdateClientsPartnersSection } from "../hooks/useUpdateClientsPartnersSection";
import type { ClientsPartnersSection } from "../services/clientsPartnersSectionService";
import { cn } from "@/lib/utils";

interface ClientsPartnersSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientsPartnersSection?: ClientsPartnersSection | null;
}

export function ClientsPartnersSectionDialog({ open, onOpenChange, clientsPartnersSection }: ClientsPartnersSectionDialogProps) {
  const isEditMode = !!clientsPartnersSection;
  const { createOrUpdateClientsPartnersSection, isPending: isCreating } = useCreateOrUpdateClientsPartnersSection();
  const { updateClientsPartnersSection, isPending: isUpdating } = useUpdateClientsPartnersSection();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOrUpdateClientsPartnersSectionFormData | UpdateClientsPartnersSectionFormData>({
    resolver: zodResolver(
      isEditMode ? updateClientsPartnersSectionSchema : createOrUpdateClientsPartnersSectionSchema
    ) as Resolver<CreateOrUpdateClientsPartnersSectionFormData | UpdateClientsPartnersSectionFormData>,
    defaultValues: isEditMode && clientsPartnersSection
      ? {
          title: clientsPartnersSection.title || "OUR CLIENTS & PARTNERS",
          description: clientsPartnersSection.description || "",
          isActive: clientsPartnersSection.isActive ?? true,
        }
      : {
          title: "OUR CLIENTS & PARTNERS",
          description: "",
          isActive: true,
        },
  });

  // Reset form when clientsPartnersSection changes (switching between create/edit)
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && clientsPartnersSection) {
        reset({
          title: clientsPartnersSection.title || "OUR CLIENTS & PARTNERS",
          description: clientsPartnersSection.description || "",
          isActive: clientsPartnersSection.isActive ?? true,
        });
      } else {
        reset({
          title: "OUR CLIENTS & PARTNERS",
          description: "",
          isActive: true,
        });
      }
    };

    resetForm();
  }, [open, clientsPartnersSection, isEditMode, reset]);

  const onSubmit = async (data: CreateOrUpdateClientsPartnersSectionFormData | UpdateClientsPartnersSectionFormData) => {
    try {
      if (isEditMode && clientsPartnersSection) {
        // Update mode
        const updatePayload: {
          title?: string;
          description?: string;
          isActive?: boolean;
        } = {};

        if (data.title) updatePayload.title = data.title;
        if (data.description) updatePayload.description = data.description;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

        await updateClientsPartnersSection({
          id: clientsPartnersSection._id,
          payload: updatePayload,
        });
      } else {
        // Create mode
        const createPayload = {
          title: (data as CreateOrUpdateClientsPartnersSectionFormData).title,
          description: (data as CreateOrUpdateClientsPartnersSectionFormData).description,
          isActive: (data as CreateOrUpdateClientsPartnersSectionFormData).isActive ?? true,
        };

        await createOrUpdateClientsPartnersSection(createPayload);
      }
      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error(`Error ${isEditMode ? "updating" : "creating"} clients & partners section:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && clientsPartnersSection
        ? {
            title: clientsPartnersSection.title || "OUR CLIENTS & PARTNERS",
            description: clientsPartnersSection.description || "",
            isActive: clientsPartnersSection.isActive ?? true,
          }
        : {
            title: "OUR CLIENTS & PARTNERS",
            description: "",
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
            {isEditMode ? "Edit Clients & Partners Section" : "Add New Clients & Partners Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the clients & partners section information"
              : "Fill in the following information to add a new clients & partners section"}
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
              rows={6}
            />
            {errors.description && (
              <p className="text-sm text-destructive" role="alert">
                {errors.description.message}
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
                ? "Update Section"
                : "Create Section"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


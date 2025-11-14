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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { ImageUpload } from "@/components/shared/ImageUpload";
import {
  createClientPartnerSchema,
  updateClientPartnerSchema,
  type CreateClientPartnerFormData,
  type UpdateClientPartnerFormData,
} from "../schemas/clientPartner.schema";
import { useCreateClientPartner } from "../hooks/useCreateClientPartner";
import { useUpdateClientPartner } from "../hooks/useUpdateClientPartner";
import type { ClientPartner } from "../services/clientPartnerService";
import { cn } from "@/lib/utils";

interface ClientPartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientPartner?: ClientPartner | null;
}

export function ClientPartnerDialog({ open, onOpenChange, clientPartner }: ClientPartnerDialogProps) {
  const isEditMode = !!clientPartner;
  const { createClientPartner, isPending: isCreating } = useCreateClientPartner();
  const { updateClientPartner, isPending: isUpdating } = useUpdateClientPartner();
  const isPending = isCreating || isUpdating;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateClientPartnerFormData | UpdateClientPartnerFormData>({
    resolver: zodResolver(
      isEditMode ? updateClientPartnerSchema : createClientPartnerSchema
    ) as Resolver<CreateClientPartnerFormData | UpdateClientPartnerFormData>,
    defaultValues: isEditMode && clientPartner
      ? {
          name: clientPartner.name || "",
          description: clientPartner.description || "",
          order: clientPartner.order ?? 0,
          isActive: clientPartner.isActive ?? true,
        }
      : {
          name: "",
          description: "",
          order: 0,
          isActive: true,
        },
  });

  // Reset form when clientPartner changes
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && clientPartner) {
        reset({
          name: clientPartner.name || "",
          description: clientPartner.description || "",
          order: clientPartner.order ?? 0,
          isActive: clientPartner.isActive ?? true,
        });
      } else {
        reset({
          name: "",
          description: "",
          order: 0,
          isActive: true,
        });
      }
      setImageFile(null);
      setImageRemoved(false);
    };

    resetForm();
  }, [open, clientPartner, isEditMode, reset]);

  const onSubmit = async (data: CreateClientPartnerFormData | UpdateClientPartnerFormData) => {
    try {
      if (isEditMode && clientPartner) {
        const updatePayload: {
          name?: string;
          description?: string;
          order?: number;
          isActive?: boolean;
          emblemImage?: File;
        } = {};

        if (data.name) updatePayload.name = data.name;
        if (data.description !== undefined) updatePayload.description = data.description;
        if (data.order !== undefined) updatePayload.order = data.order;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
        if (imageFile) {
          updatePayload.emblemImage = imageFile;
        }

        await updateClientPartner({
          id: clientPartner._id,
          payload: updatePayload,
        });
      } else {
        const createPayload = {
          name: (data as CreateClientPartnerFormData).name,
          description: (data as CreateClientPartnerFormData).description,
          order: (data as CreateClientPartnerFormData).order ?? 0,
          isActive: (data as CreateClientPartnerFormData).isActive ?? true,
          emblemImage: imageFile || undefined,
        };

        await createClientPartner(createPayload);
      }
      handleClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} client partner:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && clientPartner
        ? {
            name: clientPartner.name || "",
            description: clientPartner.description || "",
            order: clientPartner.order ?? 0,
            isActive: clientPartner.isActive ?? true,
          }
        : {
            name: "",
            description: "",
            order: 0,
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
            {isEditMode ? "Edit Client Partner" : "Add New Client Partner"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the client partner information"
              : "Fill in the following information to add a new client partner"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Emblem Image */}
          <div className="space-y-2">
            <Label htmlFor="emblemImage">
              Emblem Image (Optional)
              {isEditMode && (
                <span className="text-muted-foreground text-xs ml-2">
                  (Leave empty if you don&apos;t want to change it)
                </span>
              )}
            </Label>
            <Controller
              name="emblemImage"
              control={control}
              render={({ field: { onChange, onBlur } }) => {
                let displayValue: File | string | null = null;
                if (imageRemoved) {
                  displayValue = null;
                } else if (imageFile) {
                  displayValue = imageFile;
                } else if (isEditMode && clientPartner?.emblemImage) {
                  displayValue = clientPartner.emblemImage;
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
                    error={errors.emblemImage}
                    disabled={isPending}
                  />
                );
              }}
            />
          </div>

          {/* Name */}
          <FormField
            label="Name"
            name="name"
            type="text"
            placeholder="Enter name"
            register={register("name")}
            error={errors.name}
            required={!isEditMode}
          />

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description (Optional)
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

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order">
              Order
            </Label>
            <Input
              id="order"
              type="number"
              min="0"
              placeholder="Enter order (0 for default)"
              {...register("order", { valueAsNumber: true })}
              className={cn(errors.order && "border-destructive")}
            />
            {errors.order && (
              <p className="text-sm text-destructive" role="alert">
                {errors.order.message}
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
                ? "Update Client Partner"
                : "Create Client Partner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


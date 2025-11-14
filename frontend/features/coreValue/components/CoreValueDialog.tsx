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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import {
  createCoreValueSchema,
  updateCoreValueSchema,
  type CreateCoreValueFormData,
  type UpdateCoreValueFormData,
} from "../schemas/coreValue.schema";
import { useCreateCoreValue } from "../hooks/useCreateCoreValue";
import { useUpdateCoreValue } from "../hooks/useUpdateCoreValue";
import type { CoreValue } from "../services/coreValueService";
import { cn } from "@/lib/utils";

interface CoreValueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coreValue?: CoreValue | null;
}

export function CoreValueDialog({ open, onOpenChange, coreValue }: CoreValueDialogProps) {
  const isEditMode = !!coreValue;
  const { createCoreValue, isPending: isCreating } = useCreateCoreValue();
  const { updateCoreValue, isPending: isUpdating } = useUpdateCoreValue();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateCoreValueFormData | UpdateCoreValueFormData>({
    resolver: zodResolver(
      isEditMode ? updateCoreValueSchema : createCoreValueSchema
    ) as Resolver<CreateCoreValueFormData | UpdateCoreValueFormData>,
    defaultValues: isEditMode && coreValue
      ? {
          title: coreValue.title || "",
          description: coreValue.description || "",
          order: coreValue.order ?? 0,
          isActive: coreValue.isActive ?? true,
        }
      : {
          title: "",
          description: "",
          order: 0,
          isActive: true,
        },
  });

  // Reset form when coreValue changes
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && coreValue) {
        reset({
          title: coreValue.title || "",
          description: coreValue.description || "",
          order: coreValue.order ?? 0,
          isActive: coreValue.isActive ?? true,
        });
      } else {
        reset({
          title: "",
          description: "",
          order: 0,
          isActive: true,
        });
      }
    };

    resetForm();
  }, [open, coreValue, isEditMode, reset]);

  const onSubmit = async (data: CreateCoreValueFormData | UpdateCoreValueFormData) => {
    try {
      if (isEditMode && coreValue) {
        const updatePayload: {
          title?: string;
          description?: string;
          order?: number;
          isActive?: boolean;
        } = {};

        if (data.title) updatePayload.title = data.title;
        if (data.description) updatePayload.description = data.description;
        if (data.order !== undefined) updatePayload.order = data.order;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

        await updateCoreValue({
          id: coreValue._id,
          payload: updatePayload,
        });
      } else {
        const createPayload = {
          title: (data as CreateCoreValueFormData).title,
          description: (data as CreateCoreValueFormData).description,
          order: (data as CreateCoreValueFormData).order ?? 0,
          isActive: (data as CreateCoreValueFormData).isActive ?? true,
        };

        await createCoreValue(createPayload);
      }
      handleClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} core value:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && coreValue
        ? {
            title: coreValue.title || "",
            description: coreValue.description || "",
            order: coreValue.order ?? 0,
            isActive: coreValue.isActive ?? true,
          }
        : {
            title: "",
            description: "",
            order: 0,
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
            {isEditMode ? "Edit Core Value" : "Add New Core Value"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the core value information"
              : "Fill in the following information to add a new core value"}
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
                ? "Update Core Value"
                : "Create Core Value"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


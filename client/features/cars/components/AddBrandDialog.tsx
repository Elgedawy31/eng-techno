"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { FormField } from "@/components/ui/form-field";
import { createBrandSchema, type CreateBrandFormData } from "../schemas/brand.schema";
import { useBrands } from "../hooks/useBrand";

interface AddBrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBrandCreated?: (brand: { id: string; name: string }) => void;
}

export function AddBrandDialog({ open, onOpenChange, onBrandCreated }: AddBrandDialogProps) {
  const { createBrand, isCreating } = useBrands(1, 10, false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBrandFormData>({
    resolver: zodResolver(createBrandSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      reset({
        name: "",
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: CreateBrandFormData) => {
    try {
      const payload = {
        name: data.name,
      };

      const result = await createBrand(payload);
      
      // Call the callback with the new brand data
      if (result?.brand?._id && result?.brand?.name && onBrandCreated) {
        onBrandCreated({
          id: result.brand._id,
          name: result.brand.name,
        });
      }

      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error("Error creating brand:", error);
    }
  };

  const handleClose = () => {
    reset({
      name: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة ماركة جديدة</DialogTitle>
          <DialogDescription>
            قم بملء البيانات التالية لإضافة ماركة جديدة
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <FormField
            label="اسم الماركة"
            name="name"
            type="text"
            placeholder="أدخل اسم الماركة"
            register={register("name")}
            error={errors.name}
            required
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "جاري الإضافة..." : "إضافة الماركة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


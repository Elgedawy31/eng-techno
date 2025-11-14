"use client";

import { useEffect, useState, useRef, startTransition } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { FormField } from "@/components/ui/form-field";
import { createGradeSchema, type CreateGradeFormData } from "../schemas/grade.schema";
import { useGrades } from "../hooks/useGrade";
import { UiAutocomplete } from "@/components/shared/uiAutoComplete/UiAutocomplete";
import type { OptionType } from "@/types/api.types";

interface AddGradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGradeCreated?: (grade: { id: string; name: string }) => void;
  selectedCarName?: OptionType | null;
}

export function AddGradeDialog({ open, onOpenChange, onGradeCreated, selectedCarName: propSelectedCarName }: AddGradeDialogProps) {
  const { createGrade, isCreating } = useGrades(1, 10, undefined, false);
  const [selectedCarName, setSelectedCarName] = useState<OptionType | null>(propSelectedCarName || null);
  const prevOpenRef = useRef(open);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateGradeFormData>({
    resolver: zodResolver(createGradeSchema),
    defaultValues: {
      name: "",
      carNameId: propSelectedCarName?.id?.toString() || "",
    },
  });

  // Reset form when dialog opens/closes or when selectedCarName changes
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      // Dialog just opened - reset form
      const carNameId = propSelectedCarName?.id?.toString() || "";
      reset({
        name: "",
        carNameId: carNameId,
      });
    }
    prevOpenRef.current = open;
  }, [open, reset, propSelectedCarName]);

  // Sync selectedCarName state with prop when dialog opens
  useEffect(() => {
    if (open) {
      // Use startTransition to defer state update and avoid cascading renders
      startTransition(() => {
        setSelectedCarName(propSelectedCarName || null);
      });
    }
  }, [open, propSelectedCarName]);

  const onSubmit = async (data: CreateGradeFormData) => {
    try {
      const payload = {
        name: data.name,
        carNameId: data.carNameId,
      };

      const result = await createGrade(payload);
      
      // Call the callback with the new grade data
      if (result?.grade?._id && result?.grade?.name && onGradeCreated) {
        onGradeCreated({
          id: result.grade._id,
          name: result.grade.name,
        });
      }

      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error("Error creating grade:", error);
    }
  };

  const handleClose = () => {
    const carNameId = propSelectedCarName?.id?.toString() || "";
    reset({
      name: "",
      carNameId: carNameId,
    });
    setSelectedCarName(propSelectedCarName || null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة درجة جديدة</DialogTitle>
          <DialogDescription>
            قم بملء البيانات التالية لإضافة درجة جديدة
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Car Name Selection */}
          <div className="space-y-2">
            <Label htmlFor="carNameId">
              اسم السيارة <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="carNameId"
              control={control}
              render={({ field }) => (
                <UiAutocomplete
                  endpoint="/car-names"
                  value={selectedCarName}
                  onChange={(option) => {
                    field.onChange(option?.id || "");
                    setSelectedCarName(option);
                  }}
                  onInputChange={(value) => {
                    if (!value) {
                      field.onChange("");
                      setSelectedCarName(null);
                    }
                  }}
                  placeholder="اختر اسم السيارة"
                  nameKey="name"
                  idKey="_id"
                  className={errors.carNameId ? "border-destructive" : ""}
                  triggerOnFocus
                  disabled={!!propSelectedCarName}
                />
              )}
            />
            {errors.carNameId && (
              <p className="text-sm text-destructive" role="alert">
                {errors.carNameId.message}
              </p>
            )}
          </div>

          {/* Name */}
          <FormField
            label="اسم الدرجة"
            name="name"
            type="text"
            placeholder="أدخل اسم الدرجة"
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
              {isCreating ? "جاري الإضافة..." : "إضافة الدرجة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


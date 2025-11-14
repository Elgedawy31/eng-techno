"use client";

import { useEffect, useState, useRef, startTransition } from "react";
import { useForm, Controller, type FieldError } from "react-hook-form";
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
import { createYearSchema } from "../schemas/year.schema";
import type { z } from "zod";
import { useYears } from "../hooks/useYear";
import { UiAutocomplete } from "@/components/shared/uiAutoComplete/UiAutocomplete";
import type { OptionType } from "@/types/api.types";

interface AddYearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onYearCreated?: (year: { id: string; value: number }) => void;
  selectedGrade?: OptionType | null;
}

export function AddYearDialog({ open, onOpenChange, onYearCreated, selectedGrade: propSelectedGrade }: AddYearDialogProps) {
  const { createYear, isCreating } = useYears(1, 10, undefined, false);
  const [selectedGrade, setSelectedGrade] = useState<OptionType | null>(propSelectedGrade || null);
  const prevOpenRef = useRef(open);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<z.input<typeof createYearSchema>>({
    resolver: zodResolver(createYearSchema),
    defaultValues: {
      value: 0, // Default to 0, will be validated by schema
      gradeId: propSelectedGrade?.id?.toString() || "",
    },
  });

  // Reset form when dialog opens/closes or when selectedGrade changes
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      // Dialog just opened - reset form
      const gradeId = propSelectedGrade?.id?.toString() || "";
      reset({
        value: 0, // Default to 0, will be validated by schema
        gradeId: gradeId,
      });
    }
    prevOpenRef.current = open;
  }, [open, reset, propSelectedGrade]);

  // Sync selectedGrade state with prop when dialog opens
  useEffect(() => {
    if (open) {
      // Use startTransition to defer state update and avoid cascading renders
      startTransition(() => {
        setSelectedGrade(propSelectedGrade || null);
      });
    }
  }, [open, propSelectedGrade]);

  const onSubmit = async (data: z.input<typeof createYearSchema>) => {
    try {
      // Schema will coerce and validate the data
      const validatedData = createYearSchema.parse(data);
      const payload = {
        value: validatedData.value,
        gradeId: validatedData.gradeId,
      };

      const result = await createYear(payload);
      
      // Call the callback with the new year data
      if (result?.year?._id && result?.year?.value !== undefined && onYearCreated) {
        onYearCreated({
          id: result.year._id,
          value: result.year.value,
        });
      }

      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error("Error creating year:", error);
    }
  };

  const handleClose = () => {
    const gradeId = propSelectedGrade?.id?.toString() || "";
    reset({
      value: 0, // Default to 0, will be validated by schema
      gradeId: gradeId,
    });
    setSelectedGrade(propSelectedGrade || null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة سنة جديدة</DialogTitle>
          <DialogDescription>
            قم بملء البيانات التالية لإضافة سنة جديدة
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Grade Selection */}
          <div className="space-y-2">
            <Label htmlFor="gradeId">
              الدرجة <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="gradeId"
              control={control}
              render={({ field }) => (
                <UiAutocomplete
                  endpoint="/grades"
                  value={selectedGrade}
                  onChange={(option) => {
                    field.onChange(option?.id || "");
                    setSelectedGrade(option);
                  }}
                  onInputChange={(value) => {
                    if (!value) {
                      field.onChange("");
                      setSelectedGrade(null);
                    }
                  }}
                  placeholder="اختر الدرجة"
                  nameKey="name"
                  idKey="_id"
                  className={errors.gradeId ? "border-destructive" : ""}
                  triggerOnFocus
                  disabled={!!propSelectedGrade}
                />
              )}
            />
            {errors.gradeId && (
              <p className="text-sm text-destructive" role="alert">
                {errors.gradeId.message}
              </p>
            )}
          </div>

          {/* Value (Year) */}
          <FormField
            label="السنة"
            name="value"
            type="number"
            placeholder="أدخل السنة (مثال: 2024)"
            register={register("value", { valueAsNumber: true })}
            error={errors.value as FieldError | undefined}
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
              {isCreating ? "جاري الإضافة..." : "إضافة السنة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


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
import { createAgentSchema, type CreateAgentFormData } from "../schemas/agent.schema";
import { useAgents } from "../hooks/useAgent";
import { UiAutocomplete } from "@/components/shared/uiAutoComplete/UiAutocomplete";
import type { OptionType } from "@/types/api.types";

interface AddAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentCreated?: (agent: { id: string; name: string }) => void;
  selectedBrand?: OptionType | null;
}

export function AddAgentDialog({ open, onOpenChange, onAgentCreated, selectedBrand: propSelectedBrand }: AddAgentDialogProps) {
  const { createAgent, isCreating } = useAgents(1, 10, undefined, false);
  const [selectedBrand, setSelectedBrand] = useState<OptionType | null>(propSelectedBrand || null);
  const prevOpenRef = useRef(open);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: "",
      brandId: propSelectedBrand?.id?.toString() || "",
    },
  });

  // Reset form when dialog opens/closes or when selectedBrand changes
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      // Dialog just opened - reset form
      const brandId = propSelectedBrand?.id?.toString() || "";
      reset({
        name: "",
        brandId: brandId,
      });
    }
    prevOpenRef.current = open;
  }, [open, reset, propSelectedBrand]);

  // Sync selectedBrand state with prop when dialog opens
  useEffect(() => {
    if (open) {
      // Use startTransition to defer state update and avoid cascading renders
      startTransition(() => {
        setSelectedBrand(propSelectedBrand || null);
      });
    }
  }, [open, propSelectedBrand]);

  const onSubmit = async (data: CreateAgentFormData) => {
    try {
      const payload = {
        name: data.name,
        brandId: data.brandId,
      };

      const result = await createAgent(payload);
      
      // Call the callback with the new agent data
      if (result?.agent?._id && result?.agent?.name && onAgentCreated) {
        onAgentCreated({
          id: result.agent._id,
          name: result.agent.name,
        });
      }

      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error("Error creating agent:", error);
    }
  };

  const handleClose = () => {
    const brandId = propSelectedBrand?.id?.toString() || "";
    reset({
      name: "",
      brandId: brandId,
    });
    setSelectedBrand(propSelectedBrand || null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة وكيل جديد</DialogTitle>
          <DialogDescription>
            قم بملء البيانات التالية لإضافة وكيل جديد
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Brand Selection */}
          <div className="space-y-2">
            <Label htmlFor="brandId">
              الماركة <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="brandId"
              control={control}
              render={({ field }) => (
                <UiAutocomplete
                  endpoint="/brands"
                  value={selectedBrand}
                  onChange={(option) => {
                    field.onChange(option?.id || "");
                    setSelectedBrand(option);
                  }}
                  onInputChange={(value) => {
                    if (!value) {
                      field.onChange("");
                      setSelectedBrand(null);
                    }
                  }}
                  placeholder="اختر الماركة"
                  nameKey="name"
                  idKey="_id"
                  className={errors.brandId ? "border-destructive" : ""}
                  triggerOnFocus
                  disabled={!!propSelectedBrand}
                />
              )}
            />
            {errors.brandId && (
              <p className="text-sm text-destructive" role="alert">
                {errors.brandId.message}
              </p>
            )}
          </div>

          {/* Name */}
          <FormField
            label="اسم الوكيل"
            name="name"
            type="text"
            placeholder="أدخل اسم الوكيل"
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
              {isCreating ? "جاري الإضافة..." : "إضافة الوكيل"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


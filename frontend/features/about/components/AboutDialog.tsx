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
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { FileUpload } from "@/components/shared/FileUpload";
import {
  createOrUpdateAboutSchema,
  updateAboutSchema,
  type CreateOrUpdateAboutFormData,
  type UpdateAboutFormData,
} from "../schemas/about.schema";
import { useCreateOrUpdateAbout } from "../hooks/useCreateOrUpdateAbout";
import { useUpdateAbout } from "../hooks/useUpdateAbout";
import type { About } from "../services/aboutService";
import { cn } from "@/lib/utils";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  about?: About | null;
}

export function AboutDialog({ open, onOpenChange, about }: AboutDialogProps) {
  const isEditMode = !!about;
  const { createOrUpdateAbout, isPending: isCreating } = useCreateOrUpdateAbout();
  const { updateAbout, isPending: isUpdating } = useUpdateAbout();
  const isPending = isCreating || isUpdating;
  const [fileFile, setFileFile] = useState<File | null>(null);
  const [fileRemoved, setFileRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOrUpdateAboutFormData | UpdateAboutFormData>({
    resolver: zodResolver(
      isEditMode ? updateAboutSchema : createOrUpdateAboutSchema
    ) as Resolver<CreateOrUpdateAboutFormData | UpdateAboutFormData>,
    defaultValues: isEditMode && about
      ? {
          label: about.label || "",
          description: about.description || "",
          button1Text: about.button1Text || "EXPLORE",
          button1Action: about.button1Action || "",
          button2Text: about.button2Text || "DOWNLOAD COMPANY PROFILE",
          button2Action: about.button2Action || "",
          isActive: about.isActive ?? true,
        }
      : {
          label: "",
          description: "",
          button1Text: "EXPLORE",
          button1Action: "",
          button2Text: "DOWNLOAD COMPANY PROFILE",
          button2Action: "",
          isActive: true,
        },
  });

  // Reset form when about changes (switching between create/edit)
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && about) {
        reset({
          label: about.label || "",
          description: about.description || "",
          button1Text: about.button1Text || "EXPLORE",
          button1Action: about.button1Action || "",
          button2Text: about.button2Text || "DOWNLOAD COMPANY PROFILE",
          button2Action: about.button2Action || "",
          isActive: about.isActive ?? true,
        });
      } else {
        reset({
          label: "",
          description: "",
          button1Text: "EXPLORE",
          button1Action: "",
          button2Text: "DOWNLOAD COMPANY PROFILE",
          button2Action: "",
          isActive: true,
        });
      }
      setFileFile(null);
      setFileRemoved(false);
    };

    resetForm();
  }, [open, about, isEditMode, reset]);

  const onSubmit = async (data: CreateOrUpdateAboutFormData | UpdateAboutFormData) => {
    try {
      if (isEditMode && about) {
        // Update mode
        const updatePayload: {
          label?: string;
          description?: string;
          button1Text?: string;
          button1Action?: string;
          button2Text?: string;
          button2Action?: string;
          isActive?: boolean;
          companyProfileFile?: File;
        } = {};

        if (data.label !== undefined) updatePayload.label = data.label;
        if (data.description) updatePayload.description = data.description;
        if (data.button1Text) updatePayload.button1Text = data.button1Text;
        if (data.button1Action) updatePayload.button1Action = data.button1Action;
        if (data.button2Text) updatePayload.button2Text = data.button2Text;
        if (data.button2Action !== undefined) updatePayload.button2Action = data.button2Action;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
        if (fileFile) {
          updatePayload.companyProfileFile = fileFile;
        }

        await updateAbout({
          id: about._id,
          payload: updatePayload,
        });
      } else {
        // Create mode
        const createPayload = {
          label: (data as CreateOrUpdateAboutFormData).label,
          description: (data as CreateOrUpdateAboutFormData).description,
          button1Text: (data as CreateOrUpdateAboutFormData).button1Text,
          button1Action: (data as CreateOrUpdateAboutFormData).button1Action,
          button2Text: (data as CreateOrUpdateAboutFormData).button2Text,
          button2Action: (data as CreateOrUpdateAboutFormData).button2Action,
          isActive: (data as CreateOrUpdateAboutFormData).isActive ?? true,
          companyProfileFile: fileFile || undefined,
        };

        await createOrUpdateAbout(createPayload);
      }
      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error(`Error ${isEditMode ? "updating" : "creating"} about:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && about
        ? {
            label: about.label || "",
            description: about.description || "",
            button1Text: about.button1Text || "EXPLORE",
            button1Action: about.button1Action || "",
            button2Text: about.button2Text || "DOWNLOAD COMPANY PROFILE",
            button2Action: about.button2Action || "",
            isActive: about.isActive ?? true,
          }
        : {
            label: "",
            description: "",
            button1Text: "EXPLORE",
            button1Action: "",
            button2Text: "DOWNLOAD COMPANY PROFILE",
            button2Action: "",
            isActive: true,
          }
    );
    setFileFile(null);
    setFileRemoved(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit About Section" : "Add New About Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the about section information"
              : "Fill in the following information to add a new about section"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Label */}
          <FormField
            label="Label"
            name="label"
            type="text"
            placeholder="Enter label (e.g., //DEFINING TECHNO)"
            register={register("label")}
            error={errors.label}
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

          {/* Button 1 Text */}
          <FormField
            label="Button 1 Text"
            name="button1Text"
            type="text"
            placeholder="Enter button 1 text"
            register={register("button1Text")}
            error={errors.button1Text}
            required={!isEditMode}
          />

          {/* Button 1 Action */}
          <FormField
            label="Button 1 Action"
            name="button1Action"
            type="text"
            placeholder="Enter button 1 action URL or path"
            register={register("button1Action")}
            error={errors.button1Action}
            required={!isEditMode}
          />

          {/* Button 2 Text */}
          <FormField
            label="Button 2 Text"
            name="button2Text"
            type="text"
            placeholder="Enter button 2 text"
            register={register("button2Text")}
            error={errors.button2Text}
            required={!isEditMode}
          />

          {/* Button 2 Action */}
          <FormField
            label="Button 2 Action"
            name="button2Action"
            type="text"
            placeholder="Enter button 2 action URL or path (optional)"
            register={register("button2Action")}
            error={errors.button2Action}
          />

          {/* Company Profile File */}
          <div className="space-y-2">
            <Label htmlFor="companyProfileFile">
              Company Profile File (PDF)
              {isEditMode && (
                <span className="text-muted-foreground text-xs ml-2">
                  (Leave empty if you don&apos;t want to change it)
                </span>
              )}
            </Label>
            <Controller
              name="companyProfileFile"
              control={control}
              render={({ field: { onChange, onBlur } }: { field: { onChange: (value: File | undefined) => void; onBlur: () => void } }) => {
                // Determine the value to display
                let displayValue: File | string | null = null;
                if (fileRemoved) {
                  displayValue = null;
                } else if (fileFile) {
                  displayValue = fileFile;
                } else if (isEditMode && about?.companyProfileFile) {
                  displayValue = about.companyProfileFile;
                }

                return (
                  <FileUpload
                    value={displayValue}
                    onChange={(file) => {
                      if (file === null) {
                        // File was removed
                        setFileFile(null);
                        setFileRemoved(true);
                        onChange(undefined);
                      } else {
                        // New file was selected
                        setFileFile(file);
                        setFileRemoved(false);
                        onChange(file);
                      }
                    }}
                    onBlur={onBlur}
                    error={errors.companyProfileFile}
                    disabled={isPending}
                    maxSize={10 * 1024 * 1024}
                  />
                );
              }}
            />
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
                ? "Update About"
                : "Create About"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


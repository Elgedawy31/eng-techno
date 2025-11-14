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
import { ImageUpload } from "@/components/shared/ImageUpload";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  type CreateAnnouncementFormData,
  type UpdateAnnouncementFormData,
} from "../schemas/announcement.schema";
import { useCreateAnnouncement } from "../hooks/useCreateAnnouncement";
import { useUpdateAnnouncement } from "../hooks/useUpdateAnnouncement";
import type { Announcement } from "../services/announcementService";
import { cn } from "@/lib/utils";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: Announcement | null;
}

export function AnnouncementDialog({ open, onOpenChange, announcement }: AnnouncementDialogProps) {
  const isEditMode = !!announcement;
  const { createAnnouncement, isPending: isCreating } = useCreateAnnouncement();
  const { updateAnnouncement, isPending: isUpdating } = useUpdateAnnouncement();
  const isPending = isCreating || isUpdating;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateAnnouncementFormData | UpdateAnnouncementFormData>({
    resolver: zodResolver(
      isEditMode ? updateAnnouncementSchema : createAnnouncementSchema
    ) as Resolver<CreateAnnouncementFormData | UpdateAnnouncementFormData>,
    defaultValues: isEditMode && announcement
      ? {
          title: announcement.title || "",
          tagline: announcement.tagline || "",
          description: announcement.description || "",
          eventDateText: announcement.eventDateText || "",
          boothInfo: announcement.boothInfo || "",
          isActive: announcement.isActive ?? true,
        }
      : {
          title: "",
          tagline: "",
          description: "",
          eventDateText: "",
          boothInfo: "",
          isActive: true,
        },
  });

  // Reset form when announcement changes
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && announcement) {
        reset({
          title: announcement.title || "",
          tagline: announcement.tagline || "",
          description: announcement.description || "",
          eventDateText: announcement.eventDateText || "",
          boothInfo: announcement.boothInfo || "",
          isActive: announcement.isActive ?? true,
        });
      } else {
        reset({
          title: "",
          tagline: "",
          description: "",
          eventDateText: "",
          boothInfo: "",
          isActive: true,
        });
      }
      setImageFile(null);
      setImageRemoved(false);
    };

    resetForm();
  }, [open, announcement, isEditMode, reset]);

  const onSubmit = async (data: CreateAnnouncementFormData | UpdateAnnouncementFormData) => {
    try {
      if (isEditMode && announcement) {
        // Update mode
        const updatePayload: {
          title?: string;
          tagline?: string;
          description?: string;
          eventDateText?: string;
          boothInfo?: string;
          isActive?: boolean;
          eventLogoImage?: File;
        } = {};

        if (data.title) updatePayload.title = data.title;
        if (data.tagline !== undefined) updatePayload.tagline = data.tagline;
        if (data.description) updatePayload.description = data.description;
        if (data.eventDateText !== undefined) updatePayload.eventDateText = data.eventDateText;
        if (data.boothInfo !== undefined) updatePayload.boothInfo = data.boothInfo;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
        
        if (imageFile) {
          updatePayload.eventLogoImage = imageFile;
        }

        await updateAnnouncement({
          id: announcement._id,
          payload: updatePayload,
        });
      } else {
        // Create mode
        const createPayload = {
          title: (data as CreateAnnouncementFormData).title,
          tagline: (data as CreateAnnouncementFormData).tagline,
          description: (data as CreateAnnouncementFormData).description,
          eventDateText: (data as CreateAnnouncementFormData).eventDateText,
          boothInfo: (data as CreateAnnouncementFormData).boothInfo,
          isActive: (data as CreateAnnouncementFormData).isActive ?? true,
          eventLogoImage: imageFile || undefined,
        };

        await createAnnouncement(createPayload);
      }
      handleClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} announcement:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && announcement
        ? {
            title: announcement.title || "",
            tagline: announcement.tagline || "",
            description: announcement.description || "",
            eventDateText: announcement.eventDateText || "",
            boothInfo: announcement.boothInfo || "",
            isActive: announcement.isActive ?? true,
          }
        : {
            title: "",
            tagline: "",
            description: "",
            eventDateText: "",
            boothInfo: "",
            isActive: true,
          }
    );
    setImageFile(null);
    setImageRemoved(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Announcement" : "Add New Announcement"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the announcement information"
              : "Fill in the following information to add a new announcement"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Event Logo Image */}
          <div className="space-y-2">
            <Label htmlFor="eventLogoImage">
              Event Logo Image
              {isEditMode && (
                <span className="text-muted-foreground text-xs ml-2">
                  (Leave empty if you don&apos;t want to change it)
                </span>
              )}
            </Label>
            <Controller
              name="eventLogoImage"
              control={control}
              render={({ field: { onChange, onBlur } }: { field: { onChange: (value: File | undefined) => void; onBlur: () => void } }) => {
                let displayValue: File | string | null = null;
                if (imageRemoved) {
                  displayValue = null;
                } else if (imageFile) {
                  displayValue = imageFile;
                } else if (isEditMode && announcement?.eventLogoImage) {
                  displayValue = announcement.eventLogoImage;
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
                    error={errors.eventLogoImage}
                    disabled={isPending}
                  />
                );
              }}
            />
          </div>

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

          {/* Tagline */}
          <FormField
            label="Tagline"
            name="tagline"
            type="text"
            placeholder="Enter tagline (optional)"
            register={register("tagline")}
            error={errors.tagline}
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

          {/* Event Date Text */}
          <FormField
            label="Event Date Text"
            name="eventDateText"
            type="text"
            placeholder="Enter event date text (optional)"
            register={register("eventDateText")}
            error={errors.eventDateText}
          />

          {/* Booth Info */}
          <FormField
            label="Booth Info"
            name="boothInfo"
            type="text"
            placeholder="Enter booth info (optional)"
            register={register("boothInfo")}
            error={errors.boothInfo}
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
                  : "Creating..."
                : isEditMode
                ? "Update Announcement"
                : "Create Announcement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


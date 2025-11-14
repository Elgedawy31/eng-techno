"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { useDropzone } from "react-dropzone";
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
  createEventSchema,
  updateEventSchema,
  type CreateEventFormData,
  type UpdateEventFormData,
} from "../schemas/event.schema";
import { useCreateEvent } from "../hooks/useCreateEvent";
import { useUpdateEvent } from "../hooks/useUpdateEvent";
import { useDeleteEventImage } from "../hooks/useDeleteEventImage";
import type { Event } from "../services/eventService";
import { cn } from "@/lib/utils";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
}

export function EventDialog({ open, onOpenChange, event }: EventDialogProps) {
  const isEditMode = !!event;
  const { createEvent, isPending: isCreating } = useCreateEvent();
  const { updateEvent, isPending: isUpdating } = useUpdateEvent();
  const { deleteEventImage } = useDeleteEventImage();
  const isPending = isCreating || isUpdating;
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoRemoved, setLogoRemoved] = useState(false);
  const [displayImageFiles, setDisplayImageFiles] = useState<File[]>([]);
  const [displayImageUrls, setDisplayImageUrls] = useState<string[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<CreateEventFormData | UpdateEventFormData>({
    resolver: zodResolver(
      isEditMode ? updateEventSchema : createEventSchema
    ) as Resolver<CreateEventFormData | UpdateEventFormData>,
    defaultValues: isEditMode && event
      ? {
          title: event.title || "",
          shortDescription: event.shortDescription || "",
          eventDateText: event.eventDateText || "",
          detailsButtonText: event.detailsButtonText || "VIEW FULL EVENT DETAILS",
          detailsButtonAction: event.detailsButtonAction || "",
          displayImages: event.displayImages || [],
          order: event.order ?? 0,
          isActive: event.isActive ?? true,
        }
      : {
          title: "",
          shortDescription: "",
          eventDateText: "",
          detailsButtonText: "VIEW FULL EVENT DETAILS",
          detailsButtonAction: "",
          displayImages: [],
          order: 0,
          isActive: true,
        },
  });

  const displayImages = watch("displayImages") || [];

  // Reset form when event changes
  useEffect(() => {
    if (!open) return;

    const resetForm = () => {
      if (isEditMode && event) {
        reset({
          title: event.title || "",
          shortDescription: event.shortDescription || "",
          eventDateText: event.eventDateText || "",
          detailsButtonText: event.detailsButtonText || "VIEW FULL EVENT DETAILS",
          detailsButtonAction: event.detailsButtonAction || "",
          displayImages: event.displayImages || [],
          order: event.order ?? 0,
          isActive: event.isActive ?? true,
        });
        setDisplayImageUrls(event.displayImages || []);
      } else {
        reset({
          title: "",
          shortDescription: "",
          eventDateText: "",
          detailsButtonText: "VIEW FULL EVENT DETAILS",
          detailsButtonAction: "",
          displayImages: [],
          order: 0,
          isActive: true,
        });
        setDisplayImageUrls([]);
      }
      setLogoFile(null);
      setLogoRemoved(false);
      setDisplayImageFiles([]);
      setRemovedImageUrls([]);
    };

    resetForm();
  }, [open, event, isEditMode, reset]);

  const onDropDisplayImages = useCallback((acceptedFiles: File[]) => {
    const currentCount = displayImageFiles.length + displayImageUrls.length - removedImageUrls.length;
    const remainingSlots = 10 - currentCount;
    const filesToAdd = acceptedFiles.slice(0, remainingSlots);
    setDisplayImageFiles((prev) => [...prev, ...filesToAdd]);
  }, [displayImageFiles.length, displayImageUrls.length, removedImageUrls.length]);

  const { getRootProps: getDisplayImagesRootProps, getInputProps: getDisplayImagesInputProps, isDragActive: isDisplayImagesDragActive } = useDropzone({
    onDrop: onDropDisplayImages,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 10 * 1024 * 1024,
    disabled: isPending,
  });

  const handleRemoveDisplayImageFile = (index: number) => {
    setDisplayImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveDisplayImageUrl = async (imageUrl: string) => {
    if (isEditMode && event) {
      try {
        // Delete the image from Cloudinary
        await deleteEventImage({ id: event._id, imagePath: imageUrl });
      } catch (error) {
        console.error("Error deleting image:", error);
      }
      // Update local state
      const updatedUrls = displayImageUrls.filter((url) => url !== imageUrl);
      setRemovedImageUrls((prev) => [...prev, imageUrl]);
      setDisplayImageUrls(updatedUrls);
      setValue("displayImages", updatedUrls);
    }
  };

  const onSubmit = async (data: CreateEventFormData | UpdateEventFormData) => {
    try {
      if (isEditMode && event) {
        // Update mode
        const updatePayload: {
          title?: string;
          shortDescription?: string;
          eventDateText?: string;
          detailsButtonText?: string;
          detailsButtonAction?: string;
          displayImages?: string[];
          order?: number;
          isActive?: boolean;
          eventLogoImage?: File;
          displayImagesFiles?: File[];
        } = {};

        if (data.title) updatePayload.title = data.title;
        if (data.shortDescription) updatePayload.shortDescription = data.shortDescription;
        if (data.eventDateText !== undefined) updatePayload.eventDateText = data.eventDateText;
        if (data.detailsButtonText) updatePayload.detailsButtonText = data.detailsButtonText;
        if (data.detailsButtonAction) updatePayload.detailsButtonAction = data.detailsButtonAction;
        if (data.order !== undefined) updatePayload.order = data.order;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
        
        // Handle display images - keep existing ones minus removed ones
        const finalDisplayImages = displayImageUrls.filter((url) => !removedImageUrls.includes(url));
        updatePayload.displayImages = finalDisplayImages;
        
        if (logoFile) {
          updatePayload.eventLogoImage = logoFile;
        }
        if (displayImageFiles.length > 0) {
          updatePayload.displayImagesFiles = displayImageFiles;
        }

        await updateEvent({
          id: event._id,
          payload: updatePayload,
        });
      } else {
        // Create mode
        const createPayload = {
          title: (data as CreateEventFormData).title,
          shortDescription: (data as CreateEventFormData).shortDescription,
          eventDateText: (data as CreateEventFormData).eventDateText,
          detailsButtonText: (data as CreateEventFormData).detailsButtonText,
          detailsButtonAction: (data as CreateEventFormData).detailsButtonAction,
          // Don't send displayImages in body when we have files - files will be sent separately
          displayImages: displayImageFiles.length === 0 ? ((data as CreateEventFormData).displayImages || []) : undefined,
          order: (data as CreateEventFormData).order ?? 0,
          isActive: (data as CreateEventFormData).isActive ?? true,
          eventLogoImage: logoFile || undefined,
          displayImagesFiles: displayImageFiles.length > 0 ? displayImageFiles : undefined,
        };

        await createEvent(createPayload);
      }
      handleClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} event:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && event
        ? {
            title: event.title || "",
            shortDescription: event.shortDescription || "",
            eventDateText: event.eventDateText || "",
            detailsButtonText: event.detailsButtonText || "VIEW FULL EVENT DETAILS",
            detailsButtonAction: event.detailsButtonAction || "",
            displayImages: event.displayImages || [],
            order: event.order ?? 0,
            isActive: event.isActive ?? true,
          }
        : {
            title: "",
            shortDescription: "",
            eventDateText: "",
            detailsButtonText: "VIEW FULL EVENT DETAILS",
            detailsButtonAction: "",
            displayImages: [],
            order: 0,
            isActive: true,
          }
    );
    setLogoFile(null);
    setLogoRemoved(false);
    setDisplayImageFiles([]);
    setDisplayImageUrls(isEditMode && event ? event.displayImages || [] : []);
    setRemovedImageUrls([]);
    onOpenChange(false);
  };

  const totalDisplayImages = displayImageFiles.length + displayImageUrls.length - removedImageUrls.length;
  const canAddMoreImages = totalDisplayImages < 10;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Event" : "Add New Event"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the event information"
              : "Fill in the following information to add a new event"}
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
                if (logoRemoved) {
                  displayValue = null;
                } else if (logoFile) {
                  displayValue = logoFile;
                } else if (isEditMode && event?.eventLogoImage) {
                  displayValue = event.eventLogoImage;
                }

                return (
                  <ImageUpload
                    value={displayValue}
                    onChange={(file) => {
                      if (file === null) {
                        setLogoFile(null);
                        setLogoRemoved(true);
                        onChange(undefined);
                      } else {
                        setLogoFile(file);
                        setLogoRemoved(false);
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

          {/* Short Description */}
          <div className="space-y-2">
            <Label htmlFor="shortDescription">
              Short Description {!isEditMode && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="shortDescription"
              placeholder="Enter short description"
              {...register("shortDescription")}
              className={cn(errors.shortDescription && "border-destructive")}
              rows={4}
            />
            {errors.shortDescription && (
              <p className="text-sm text-destructive" role="alert">
                {errors.shortDescription.message}
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

          {/* Details Button Text */}
          <FormField
            label="Details Button Text"
            name="detailsButtonText"
            type="text"
            placeholder="Enter details button text"
            register={register("detailsButtonText")}
            error={errors.detailsButtonText}
            required={!isEditMode}
          />

          {/* Details Button Action */}
          <FormField
            label="Details Button Action"
            name="detailsButtonAction"
            type="text"
            placeholder="Enter details button action URL or path"
            register={register("detailsButtonAction")}
            error={errors.detailsButtonAction}
            required={!isEditMode}
          />

          {/* Display Images */}
          <div className="space-y-2">
            <Label htmlFor="displayImages">
              Display Images (Max 10) - {totalDisplayImages}/10
            </Label>
            
            {/* Existing Images Grid */}
            {(displayImageUrls.length > 0 || displayImageFiles.length > 0) && (
              <div className="grid grid-cols-4 gap-4 mb-4">
                {/* Existing URL images */}
                {displayImageUrls.map((imageUrl, index) => (
                  <div key={`url-${index}`} className="relative group">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border bg-muted">
                      <Image
                        src={imageUrl}
                        alt={`Display ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {!isPending && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveDisplayImageUrl(imageUrl)}
                            className="rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* New file images */}
                {displayImageFiles.map((file, index) => {
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <div key={`file-${index}`} className="relative group">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border bg-muted">
                        <Image
                          src={previewUrl}
                          alt={`New ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {!isPending && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                URL.revokeObjectURL(previewUrl);
                                handleRemoveDisplayImageFile(index);
                              }}
                              className="rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upload Area */}
            {canAddMoreImages && (
              <div
                {...getDisplayImagesRootProps()}
                className={cn(
                  "relative cursor-pointer rounded-lg border-2 border-dashed transition-colors p-8 text-center",
                  isDisplayImagesDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                  isPending && "cursor-not-allowed opacity-50"
                )}
              >
                <input {...getDisplayImagesInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4">
                  <div
                    className={cn(
                      "rounded-full p-4",
                      isDisplayImagesDragActive ? "bg-primary/10" : "bg-muted"
                    )}
                  >
                    {isDisplayImagesDragActive ? (
                      <Upload className="w-8 h-8 text-primary" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {isDisplayImagesDragActive
                        ? "Drop the images here"
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP up to 10MB (Max {10 - totalDisplayImages} more)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errors.displayImagesFiles && (
              <p className="text-sm text-destructive" role="alert">
                {errors.displayImagesFiles.message}
              </p>
            )}
          </div>

          {/* Order */}
          <FormField
            label="Order"
            name="order"
            type="number"
            placeholder="Enter order (0 for default)"
            register={register("order", { valueAsNumber: true })}
            error={errors.order}
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
                ? "Update Event"
                : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


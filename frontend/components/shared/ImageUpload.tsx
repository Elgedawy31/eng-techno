"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  onBlur?: () => void;
  error?: { message?: string };
  disabled?: boolean;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  className?: string;
  previewClassName?: string;
}

export function ImageUpload({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".webp" , ".svg"],
  },
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
  previewClassName,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  );
  const [file, setFile] = useState<File | null>(
    value instanceof File ? value : null
  );

  // Sync with value prop
  useEffect(() => {
    if (value instanceof File) {
      setFile(value);
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string") {
      setFile(null);
      setPreview(value);
    } else if (value === null) {
      setFile(null);
      setPreview(null);
    }
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        onChange(selectedFile);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      maxFiles: 1,
      disabled,
      onDropRejected: () => {
        // Error handling is done via fileRejections
      },
    });

  const handleRemove = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    onChange(null);
    onBlur?.();
  };

  const displayPreview = preview || (typeof value === "string" ? value : null);
  const hasError = !!error || fileRejections.length > 0;
  const errorMessage =
    error?.message ||
    (fileRejections.length > 0
      ? fileRejections[0].errors[0]?.message || "Invalid file"
      : null);

  return (
    <div className={cn("space-y-2", className)}>
      {displayPreview ? (
        <div className={cn("relative group", previewClassName)}>
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-muted">
            <img
              src={displayPreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={handleRemove}
                  className="rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "relative cursor-pointer rounded-lg border-2 border-dashed transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
            hasError && "border-destructive",
            disabled && "cursor-not-allowed opacity-50",
            "p-8 text-center"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className={cn(
                "rounded-full p-4",
                isDragActive ? "bg-primary/10" : "bg-muted"
              )}
            >
              {isDragActive ? (
                <Upload className="w-8 h-8 text-primary" />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Drop the image here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP up to {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {!displayPreview && (
        <div
          {...getRootProps()}
          className={cn(
            "text-center",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <input {...getInputProps()} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Image
          </Button>
        </div>
      )}

      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}


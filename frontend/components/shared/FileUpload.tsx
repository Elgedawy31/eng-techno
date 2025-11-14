"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  onBlur?: () => void;
  error?: { message?: string };
  disabled?: boolean;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  accept = {
    "application/pdf": [".pdf"],
  },
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(
    value instanceof File ? value : null
  );
  const [fileUrl, setFileUrl] = useState<string | null>(
    typeof value === "string" ? value : null
  );

  // Sync with value prop
  useEffect(() => {
    if (value instanceof File) {
      setFile(value);
      setFileUrl(null);
    } else if (typeof value === "string") {
      setFile(null);
      setFileUrl(value);
    } else if (value === null) {
      setFile(null);
      setFileUrl(null);
    }
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setFileUrl(null);
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
    setFile(null);
    setFileUrl(null);
    onChange(null);
    onBlur?.();
  };

  const hasError = !!error || fileRejections.length > 0;
  const errorMessage =
    error?.message ||
    (fileRejections.length > 0
      ? fileRejections[0].errors[0]?.message || "Invalid file"
      : null);

  const displayFileName = file?.name || (fileUrl ? "Current file" : null);

  return (
    <div className={cn("space-y-2", className)}>
      {displayFileName ? (
        <div className="relative group">
          <div className="relative w-full rounded-lg border border-border bg-muted p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full p-2 bg-primary/10">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{displayFileName}</p>
                  {file && (
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {fileUrl && (
              <div className="mt-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View current file
                </a>
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
                <FileText className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Drop the file here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground">
                PDF up to {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {!displayFileName && (
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
            Select File
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


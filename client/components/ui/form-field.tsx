"use client";

import * as React from "react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  register: UseFormRegisterReturn;
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  error,
  disabled,
  required,
  className,
  inputClassName,
  labelClassName,
  register,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={name}
        className={labelClassName}
      >
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClassName}
        {...register}
      />
      {error && (
        <p
          id={`${name}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}


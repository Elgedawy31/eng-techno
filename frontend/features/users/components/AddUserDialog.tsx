"use client";

import { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "../schemas/user.schema";
import { useCreateUser } from "../hooks/useCreateUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import type { User, UserRole } from "../services/userService";
import { cn } from "@/lib/utils";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

// Translate role to label
const getRoleLabel = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    admin: "Admin",
  };
  return roleMap[role] || role;
};

export function AddUserDialog({ open, onOpenChange, user }: UserDialogProps) {
  const isEditMode = !!user;
  const { createUser, isPending: isCreating } = useCreateUser();
  const { updateUser, isPending: isUpdating } = useUpdateUser();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEditMode ? updateUserSchema : createUserSchema) as Resolver<CreateUserFormData | UpdateUserFormData>,
    defaultValues: isEditMode && user
      ? {
          name: user.name || "",
          email: user.email || "",
          password: undefined,
          role: user.role || "admin",
        }
      : {
          name: "",
          email: "",
          password: undefined,
          role: "admin",
        },
  });

  // Reset form when user changes (switching between create/edit)
  useEffect(() => {
    if (open) {
      if (isEditMode && user) {
        reset({
          name: user.name || "",
          email: user.email || "",
          password: undefined,
          role: user.role || "admin",
        });
      } else {
        reset({
          name: "",
          email: "",
          password: undefined,
          role: "admin",
        });
      }
    }
  }, [open, user, isEditMode, reset]);

  const onSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    try {
      if (isEditMode && user) {
        // Update mode
        const updatePayload: {
          name?: string;
          email?: string;
          password?: string;
          role?: UserRole;
        } = {};

        if (data.name) updatePayload.name = data.name;
        if (data.email) updatePayload.email = data.email;
        if (data.password && data.password.trim() !== "") {
          updatePayload.password = data.password;
        }
        if (data.role) updatePayload.role = data.role as UserRole;

        await updateUser({
          id: user._id,
          payload: updatePayload,
        });
      } else {
        // Create mode
        const createPayload: {
          name: string;
          email: string;
          password?: string;
          role: UserRole;
        } = {
          name: (data as CreateUserFormData).name,
          email: (data as CreateUserFormData).email,
          role: (data as CreateUserFormData).role as UserRole,
        };

        if ((data as CreateUserFormData).password) {
          createPayload.password = (data as CreateUserFormData).password;
        }

        await createUser(createPayload);
      }
      handleClose();
    } catch (error) {
      // Error is handled by the hook
      console.error(`Error ${isEditMode ? "updating" : "creating"} user:`, error);
    }
  };

  const handleClose = () => {
    reset(
      isEditMode && user
        ? {
            name: user.name || "",
            email: user.email || "",
            password: undefined,
            role: user.role || "admin",
          }
        : {
            name: "",
            email: "",
            password: undefined,
            role: "admin",
          }
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the following information"
              : "Fill in the following information to add a new user"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <FormField
            label="Name"
            name="name"
            type="text"
            placeholder="Enter user name"
            register={register("name")}
            error={errors.name}
            required={!isEditMode}
          />

          {/* Email */}
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter email address"
            register={register("email")}
            error={errors.email}
            required={!isEditMode}
          />

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password {!isEditMode && <span className="text-destructive">*</span>}
              {isEditMode && (
                <span className="text-muted-foreground text-xs mr-2">
                  (Leave empty if you don&apos;t want to change it)
                </span>
              )}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isEditMode ? "Leave empty if you don&apos;t want to change it" : "Enter password"}
              {...register("password")}
              className={cn(errors.password && "border-destructive")}
            />
            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">
              Role
            </Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "admin"}
                  onValueChange={(value) => field.onChange(value as UserRole)}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      errors.role && "border-destructive ring-destructive/20"
                    )}
                    aria-invalid={errors.role ? "true" : "false"}
                  >
                    <SelectValue placeholder="Select role">
                      {getRoleLabel((field.value || "admin") as UserRole)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-sm text-destructive" role="alert">
                {errors.role.message}
              </p>
            )}
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
                  : "Adding..."
                : isEditMode
                ? "Update User"
                : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

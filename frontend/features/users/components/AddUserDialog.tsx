"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Upload, X } from "lucide-react";
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
  BRANCHES,
  type Branch,
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

// Translate role to Arabic
const getRoleLabel = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    admin: "مدير",
    sales: "مندوب مبيعات",
  };
  return roleMap[role] || role;
};

// Translate branch to Arabic
const getBranchLabel = (branch: Branch): string => {
  const branchMap: Record<Branch, string> = {
    riyadh: "الرياض",
    jeddah: "جدة",
    dammam: "الدمام",
  };
  return branchMap[branch] || branch;
};

export function AddUserDialog({ open, onOpenChange, user }: UserDialogProps) {
  const isEditMode = !!user;
  const { createUser, isPending: isCreating } = useCreateUser();
  const { updateUser, isPending: isUpdating } = useUpdateUser();
  const isPending = isCreating || isUpdating;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const existingImageUrl = user?.image || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEditMode ? updateUserSchema : createUserSchema) as Resolver<CreateUserFormData | UpdateUserFormData>,
    defaultValues: isEditMode && user
      ? {
          name: user.name || "",
          email: user.email || "",
          password: undefined,
          role: user.role || "sales",
          rating: user.rating,
          whatsNumber: user.whatsNumber,
          phoneNumber: user.phoneNumber,
          branch: user.branch,
          image: undefined,
        }
      : {
          name: "",
          email: "",
          password: undefined,
          role: "user",
          rating: undefined,
          whatsNumber: undefined,
          phoneNumber: undefined,
          branch: undefined,
          image: undefined,
        },
  });

  const role = watch("role");
  const imageFile = watch("image");
  const isSalesRole = role === "sales";

  // Reset form when user changes (switching between create/edit)
  useEffect(() => {
    if (open) {
      if (isEditMode && user) {
        reset({
          name: user.name || "",
          email: user.email || "",
          password: undefined,
          role: user.role || "user",
          rating: user.rating,
          whatsNumber: user.whatsNumber,
          phoneNumber: user.phoneNumber,
          branch: user.branch,
          image: undefined,
        });
        setImagePreview(existingImageUrl);
      } else {
        reset({
          name: "",
          email: "",
          password: undefined,
          role: "user",
          rating: undefined,
          whatsNumber: undefined,
          phoneNumber: undefined,
          branch: undefined,
          image: undefined,
        });
        setImagePreview(null);
      }
      setFileInputKey((prev) => prev + 1);
    }
  }, [open, user, isEditMode, reset, existingImageUrl]);

  // Set existing image as preview when in edit mode
  useEffect(() => {
    if (isEditMode && !imageFile && existingImageUrl) {
      setImagePreview(existingImageUrl);
    }
  }, [isEditMode, imageFile, existingImageUrl]);

  // Handle image preview
  useEffect(() => {
    if (imageFile && imageFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else if (!isEditMode || !existingImageUrl) {
      if (!isSalesRole) {
        setImagePreview(null);
      }
    }
  }, [imageFile, isEditMode, existingImageUrl, isSalesRole]);

  const onSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    try {
      if (isEditMode && user) {
        // Update mode
        const updatePayload: {
          name?: string;
          email?: string;
          password?: string;
          role?: UserRole;
          rating?: number;
          image?: File;
          whatsNumber?: string;
          phoneNumber?: string;
          branch?: Branch;
        } = {};

        if (data.name) updatePayload.name = data.name;
        if (data.email) updatePayload.email = data.email;
        if (data.password && data.password.trim() !== "") {
          updatePayload.password = data.password;
        }
        if (data.role) updatePayload.role = data.role as UserRole;
        if (data.rating !== undefined) updatePayload.rating = data.rating;
        if (data.whatsNumber) updatePayload.whatsNumber = data.whatsNumber;
        if (data.phoneNumber) updatePayload.phoneNumber = data.phoneNumber;
        if (data.branch) updatePayload.branch = data.branch as Branch;
        if (data.image && data.image instanceof File) {
          updatePayload.image = data.image;
        }

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
          rating?: number;
          image?: File;
          whatsNumber?: string;
          phoneNumber?: string;
          branch?: Branch;
        } = {
          name: (data as CreateUserFormData).name,
          email: (data as CreateUserFormData).email,
          role: (data as CreateUserFormData).role as UserRole,
        };

        if ((data as CreateUserFormData).password) {
          createPayload.password = (data as CreateUserFormData).password;
        }
        if ((data as CreateUserFormData).rating !== undefined) {
          createPayload.rating = (data as CreateUserFormData).rating;
        }
        if ((data as CreateUserFormData).whatsNumber) {
          createPayload.whatsNumber = (data as CreateUserFormData).whatsNumber;
        }
        if ((data as CreateUserFormData).phoneNumber) {
          createPayload.phoneNumber = (data as CreateUserFormData).phoneNumber;
        }
        if ((data as CreateUserFormData).branch) {
          createPayload.branch = (data as CreateUserFormData).branch as Branch;
        }
        const imageData = (data as CreateUserFormData).image;
        if (imageData && imageData instanceof File) {
          createPayload.image = imageData;
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
            role: user.role || "user",
            rating: user.rating,
            whatsNumber: user.whatsNumber,
            phoneNumber: user.phoneNumber,
            branch: user.branch,
            image: undefined,
          }
        : {
            name: "",
            email: "",
            password: undefined,
            role: "user",
            rating: undefined,
            whatsNumber: undefined,
            phoneNumber: undefined,
            branch: undefined,
            image: undefined,
          }
    );
    setImagePreview(isEditMode && user ? existingImageUrl : null);
    onOpenChange(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "قم بتعديل البيانات التالية"
              : "قم بملء البيانات التالية لإضافة مستخدم جديد"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <FormField
            label="الاسم"
            name="name"
            type="text"
            placeholder="أدخل اسم المستخدم"
            register={register("name")}
            error={errors.name}
            required={!isEditMode}
          />

          {/* Email */}
          <FormField
            label="البريد الإلكتروني"
            name="email"
            type="email"
            placeholder="أدخل البريد الإلكتروني"
            register={register("email")}
            error={errors.email}
            required={!isEditMode}
          />

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              كلمة المرور {!isEditMode && <span className="text-destructive">*</span>}
              {isEditMode && (
                <span className="text-muted-foreground text-xs mr-2">
                  (اتركه فارغًا إذا لم ترد تغييره)
                </span>
              )}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isEditMode ? "اتركه فارغًا إذا لم ترد تغييره" : "أدخل كلمة المرور"}
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
              الدور
            </Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "sales"}
                  onValueChange={(value) => field.onChange(value as UserRole)}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      errors.role && "border-destructive ring-destructive/20"
                    )}
                    aria-invalid={errors.role ? "true" : "false"}
                  >
                    <SelectValue placeholder="اختر الدور">
                      {getRoleLabel((field.value || "sales") as UserRole)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectItem value="sales" className="">مندوب مبيعات</SelectItem>
                    <SelectItem value="admin" className="">مدير</SelectItem>
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

          {/* Sales-specific fields */}
          {isSalesRole && (
            <>
              {/* Rating */}
              <FormField
                label="التقييم"
                name="rating"
                type="number"
                placeholder="أدخل التقييم (0-5)"
                register={register("rating", { valueAsNumber: true })}
                error={errors.rating}
                required={!isEditMode}
              />

              {/* WhatsApp Number */}
              <FormField
                label="رقم الواتساب"
                name="whatsNumber"
                type="text"
                placeholder="أدخل رقم الواتساب"
                register={register("whatsNumber")}
                error={errors.whatsNumber}
                required={!isEditMode}
              />

              {/* Phone Number */}
              <FormField
                label="رقم الهاتف"
                name="phoneNumber"
                type="text"
                placeholder="أدخل رقم الهاتف"
                register={register("phoneNumber")}
                error={errors.phoneNumber}
                required={!isEditMode}
              />

              {/* Branch */}
              <div className="space-y-2">
                <Label htmlFor="branch">
                  الفرع {!isEditMode && <span className="text-destructive">*</span>}
                </Label>
                <Controller
                  name="branch"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || "riyadh"}
                      onValueChange={(value) => field.onChange(value as Branch)}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          errors.branch && "border-destructive ring-destructive/20"
                        )}
                        aria-invalid={errors.branch ? "true" : "false"}
                      >
                        <SelectValue placeholder="اختر الفرع">
                          {field.value ? getBranchLabel(field.value as Branch) : "اختر الفرع"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {BRANCHES.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {getBranchLabel(branch)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.branch && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.branch.message}
                  </p>
                )}
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Label htmlFor="image">
                  صورة المستخدم {!isEditMode && <span className="text-destructive">*</span>}
                  {isEditMode && (
                    <span className="text-muted-foreground text-xs mr-2">
                      (اتركه فارغًا إذا لم ترد تغييره)
                    </span>
                  )}
                </Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="image-input"
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                        errors.image
                          ? "border-destructive bg-destructive/5 hover:bg-destructive/10"
                          : "border-border bg-muted/50 hover:bg-muted"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">انقر للتحميل</span> أو اسحب وأفلت
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WEBP (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        id="image-input"
                        key={fileInputKey}
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                      />
                    </Label>
                  </div>
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 left-2"
                        onClick={() => {
                          setValue("image", undefined, { shouldValidate: false });
                          setImagePreview(isEditMode && user ? existingImageUrl : null);
                          setFileInputKey((prev) => prev + 1);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.image.message}
                  </p>
                )}
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditMode
                  ? "جاري التحديث..."
                  : "جاري الإضافة..."
                : isEditMode
                ? "تحديث المستخدم"
                : "إضافة المستخدم"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

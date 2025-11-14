"use client";

import { useEffect } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { specificDataSchema, type SpecificDataFormData, CAR_STATUSES } from "@/features/cars/schemas/car.schema";
import { FormField } from "@/components/ui/form-field";
import { ArrayInput } from "@/components/shared/ArrayInput";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SpecificDataStepProps {
  defaultValues?: Partial<SpecificDataFormData>;
  onSubmit: (data: SpecificDataFormData) => void;
  onPrevious?: () => void;
}

// Translate status to Arabic
const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    available: "متاح",
    reserved: "محجوز",
    sold: "مباع",
    maintenance: "صيانة",
  };
  return statusMap[status] || status;
};

// Translate transmission to Arabic
const getTransmissionLabel = (transmission: string): string => {
  const transmissionMap: Record<string, string> = {
    manual: "يدوي",
    automatic: "أوتوماتيك",
  };
  return transmissionMap[transmission] || transmission;
};

function SpecificDataStep({ defaultValues, onSubmit, onPrevious }: SpecificDataStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset,
  } = useForm<SpecificDataFormData>({
    resolver: zodResolver(specificDataSchema) as Resolver<SpecificDataFormData>,
    defaultValues: defaultValues || {
      chassis: [],
      internalColors: [],
      externalColors: [],
      priceCash: undefined,
      priceFinance: undefined,
      status: "available",
      engine_capacity: undefined,
      transmission: "automatic",
      fuel_capacity: undefined,
      seat_type: "",
      location: "",
    },
  });

  const chassis = watch("chassis") || [];
  const internalColors = watch("internalColors") || [];
  const externalColors = watch("externalColors") || [];

  // Restore form data when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset({
        chassis: defaultValues.chassis || [],
        internalColors: defaultValues.internalColors || [],
        externalColors: defaultValues.externalColors || [],
        priceCash: defaultValues.priceCash,
        priceFinance: defaultValues.priceFinance,
        status: defaultValues.status || "available",
        reservedBy: defaultValues.reservedBy,
        engine_capacity: defaultValues.engine_capacity,
        transmission: defaultValues.transmission || "automatic",
        fuel_capacity: defaultValues.fuel_capacity,
        seat_type: defaultValues.seat_type || "",
        location: defaultValues.location || "",
      });
    } else {
      reset({
        chassis: [],
        internalColors: [],
        externalColors: [],
        priceCash: undefined,
        priceFinance: undefined,
        status: "available",
        engine_capacity: undefined,
        transmission: "automatic",
        fuel_capacity: undefined,
        seat_type: "",
        location: "",
      });
    }
  }, [
    defaultValues?.chassis,
    defaultValues?.internalColors,
    defaultValues?.externalColors,
    defaultValues?.priceCash,
    defaultValues?.priceFinance,
    defaultValues?.status,
    defaultValues?.engine_capacity,
    defaultValues?.transmission,
    defaultValues?.fuel_capacity,
    defaultValues?.seat_type,
    defaultValues?.location,
    reset,
  ]);

  const handleFormSubmit = (data: SpecificDataFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chassis Numbers */}
        <div className="md:col-span-2">
          <ArrayInput
            label="أرقام الشاسيه"
            name="chassis"
            value={chassis}
            onChange={(value) => setValue("chassis", value, { shouldValidate: true })}
            placeholder="أدخل رقم الشاسيه واضغط Enter"
            required
            error={errors.chassis?.message}
            pastePlaceholder="الصق أرقام الشاسيه من Excel (سطر واحد لكل رقم أو مفصولة بفواصل)"
          />
        </div>

        {/* Internal Colors */}
        <div>
          <ArrayInput
            label="الألوان الداخلية"
            name="internalColors"
            value={internalColors}
            onChange={(value) => setValue("internalColors", value, { shouldValidate: true })}
            placeholder="أدخل اللون الداخلي واضغط Enter"
            error={errors.internalColors?.message}
            pastePlaceholder="الصق الألوان الداخلية من Excel (سطر واحد لكل لون أو مفصولة بفواصل)"
          />
        </div>

        {/* External Colors */}
        <div>
          <ArrayInput
            label="الألوان الخارجية"
            name="externalColors"
            value={externalColors}
            onChange={(value) => setValue("externalColors", value, { shouldValidate: true })}
            placeholder="أدخل اللون الخارجي واضغط Enter"
            error={errors.externalColors?.message}
            pastePlaceholder="الصق الألوان الخارجية من Excel (سطر واحد لكل لون أو مفصولة بفواصل)"
          />
        </div>

        {/* Price Cash */}
        <FormField
          label="السعر النقدي"
          name="priceCash"
          type="number"
          placeholder="أدخل السعر النقدي"
          register={register("priceCash", { valueAsNumber: true })}
          error={errors.priceCash}
          required
        />

        {/* Price Finance */}
        <FormField
          label="السعر بالتقسيط"
          name="priceFinance"
          type="number"
          placeholder="أدخل السعر بالتقسيط"
          register={register("priceFinance", { valueAsNumber: true })}
          error={errors.priceFinance}
          required
        />

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">
            الحالة <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "available"}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    errors.status && "border-destructive ring-destructive/20"
                  )}
                  aria-invalid={errors.status ? "true" : "false"}
                >
                  <SelectValue placeholder="اختر الحالة">
                    {getStatusLabel(field.value || "available")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CAR_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-sm text-destructive" role="alert">
              {errors.status.message}
            </p>
          )}
        </div>

        {/* Transmission */}
        <div className="space-y-2">
          <Label htmlFor="transmission">نوع ناقل الحركة</Label>
          <Controller
            name="transmission"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "automatic"}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    errors.transmission && "border-destructive ring-destructive/20"
                  )}
                  aria-invalid={errors.transmission ? "true" : "false"}
                >
                  <SelectValue placeholder="اختر نوع ناقل الحركة">
                    {getTransmissionLabel(field.value || "automatic")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">أوتوماتيك</SelectItem>
                  <SelectItem value="manual">يدوي</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.transmission && (
            <p className="text-sm text-destructive" role="alert">
              {errors.transmission.message}
            </p>
          )}
        </div>

        {/* Engine Capacity */}
        <FormField
          label="سعة المحرك"
          name="engine_capacity"
          type="number"
          placeholder="أدخل سعة المحرك (لتر)"
          register={register("engine_capacity", { valueAsNumber: true })}
          error={errors.engine_capacity}
        />

        {/* Fuel Capacity */}
        <FormField
          label="سعة خزان الوقود"
          name="fuel_capacity"
          type="number"
          placeholder="أدخل سعة خزان الوقود (لتر)"
          register={register("fuel_capacity", { valueAsNumber: true })}
          error={errors.fuel_capacity}
        />

        {/* Seat Type */}
        <FormField
          label="نوع المقاعد"
          name="seat_type"
          type="text"
          placeholder="أدخل نوع المقاعد"
          register={register("seat_type")}
          error={errors.seat_type}
        />

        {/* Location */}
        <FormField
          label="الموقع"
          name="location"
          type="text"
          placeholder="أدخل موقع السيارة"
          register={register("location")}
          error={errors.location}
        />
      </div>

      <div className="flex justify-between mt-6">
        {onPrevious && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            السابق
          </Button>
        )}
        <Button type="submit" className={onPrevious ? "" : "ml-auto"}>
          التالي
        </Button>
      </div>
    </form>
  );
}

export default SpecificDataStep;


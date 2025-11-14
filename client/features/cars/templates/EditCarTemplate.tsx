"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Stepper, StepInterface } from "@/components/shared/Stepper";
import { useCarById, useCars } from "@/features/cars/hooks/useCar";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { getErrorMessage } from "@/utils/api.utils";
import { useState, useMemo } from "react";
import GeneralDataStep from "@/features/cars/components/steps/GeneralDataStep";
import SpecificDataStep from "@/features/cars/components/steps/SpecificDataStep";
import ImagesAndDescriptionStep from "@/features/cars/components/steps/ImagesAndDescriptionStep";
import type { GeneralDataFormData, SpecificDataFormData, ImagesAndDescriptionFormData } from "@/features/cars/schemas/car.schema";
import type { OptionType } from "@/types/api.types";
import type { UpdateCarPayload } from "@/features/cars/types/car.types";
import { toast } from "sonner";

function EditCarTemplate() {
  const router = useRouter();
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const carId = params?.id as string | undefined;
  const { car, isLoading: isLoadingCar, isError: isErrorCar, error: carError } = useCarById(carId);
  const { updateCar, isUpdating } = useCars();
  
  // Store form data from each step
  const [generalData, setGeneralData] = useState<GeneralDataFormData | null>(null);
  const [specificData, setSpecificData] = useState<SpecificDataFormData | null>(null);
  const [imagesAndDescriptionData, setImagesAndDescriptionData] = useState<ImagesAndDescriptionFormData | null>(null);
  
  // Map car data to defaultValues for GeneralDataStep
  const generalDataDefaultValues = useMemo<Partial<GeneralDataFormData> | undefined>(() => {
    if (!car) return undefined;
    
    return {
      brandId: car.brandId?._id?.toString() || "",
      agentId: car.agentId?._id?.toString() || "",
      carNameId: car.carNameId?._id?.toString() || "",
      gradeId: car.gradeId?._id?.toString() || "",
      yearId: car.yearId?._id?.toString() || "",
    };
  }, [car]);

  // Map car data to selected options for GeneralDataStep
  const initialSelectedBrand = useMemo<OptionType | null>(() => {
    if (!car?.brandId) return null;
    return {
      id: car.brandId._id,
      name: car.brandId.name,
    };
  }, [car]);

  const initialSelectedAgent = useMemo<OptionType | null>(() => {
    if (!car?.agentId) return null;
    return {
      id: car.agentId._id,
      name: car.agentId.name,
    };
  }, [car]);

  const initialSelectedCarName = useMemo<OptionType | null>(() => {
    if (!car?.carNameId) return null;
    return {
      id: car.carNameId._id,
      name: car.carNameId.name,
    };
  }, [car]);

  const initialSelectedGrade = useMemo<OptionType | null>(() => {
    if (!car?.gradeId) return null;
    return {
      id: car.gradeId._id,
      name: car.gradeId.name,
    };
  }, [car]);

  const initialSelectedYear = useMemo<OptionType | null>(() => {
    if (!car?.yearId) return null;
    return {
      id: car.yearId._id,
      name: car.yearId.value.toString(), // Years use value instead of name
    };
  }, [car]);

  // Map car data to defaultValues for SpecificDataStep
  const specificDataDefaultValues = useMemo<Partial<SpecificDataFormData> | undefined>(() => {
    if (!car) return undefined;
    
    return {
      chassis: car.chassis || [],
      internalColors: car.internalColors || [],
      externalColors: car.externalColors || [],
      priceCash: car.priceCash,
      priceFinance: car.priceFinance,
      status: car.status,
      reservedBy: car.reservedBy?._id || null,
      engine_capacity: car.engine_capacity,
      transmission: car.transmission,
      fuel_capacity: car.fuel_capacity,
      seat_type: car.seat_type,
      location: car.location,
    };
  }, [car]);

  // Map car data to defaultValues for ImagesAndDescriptionStep
  const imagesAndDescriptionDefaultValues = useMemo<Partial<ImagesAndDescriptionFormData> | undefined>(() => {
    if (imagesAndDescriptionData) return imagesAndDescriptionData;
    if (!car) return undefined;
    return {
      description: car.description || "",
      images: [], // Images are handled via existingImages prop
    };
  }, [car, imagesAndDescriptionData]);

  const steps: StepInterface[] = [
    {
      id: 1,
      title: "البيانات العامة",
      description: "المعلومات الأساسية",
    },
    {
      id: 2,
      title: "البيانات الخاصة",
      description: "التفاصيل الإضافية",
    },
    {
      id: 3,
      title: "الصور والوصف",
      description: "الصور والوصف التفصيلي",
    },
  ];

  if (isLoadingCar) {
    return (
      <section className="space-y-6">
        <PageHeader
          title="تعديل السيارة"
          description="جاري تحميل بيانات السيارة..."
        />
        <UniLoading />
      </section>
    );
  }

  if (isErrorCar || !car) {
    return (
      <section className="space-y-6">
        <PageHeader
          title="تعديل السيارة"
          description="حدث خطأ أثناء تحميل بيانات السيارة"
        />
        <Card>
          <CardContent className="pt-6">
            <NoDataMsg
              icon={AlertCircle}
              title="حدث خطأ"
              description={getErrorMessage(carError) || "فشل تحميل بيانات السيارة"}
              iconBgColor="bg-destructive/10"
              iconColor="text-destructive"
            />
          </CardContent>
        </Card>
      </section>
    );
  }

  const handleGeneralDataSubmit = (data: GeneralDataFormData) => {
    setGeneralData(data);
    setCurrentStep(2);
  };

  const handleSpecificDataSubmit = (data: SpecificDataFormData) => {
    setSpecificData(data);
    setCurrentStep(3);
  };

  const handlePreviousFromStep2 = () => {
    setCurrentStep(1);
  };

  const handleImagesAndDescriptionSubmit = async (data: ImagesAndDescriptionFormData & { existingImagesToKeep?: string[] }) => {
    if (!carId) {
      console.error("Car ID is required");
      return;
    }

    // Combine all data into UpdateCarPayload
    // Use form data if available, otherwise fall back to default values
    const payload: UpdateCarPayload = {
      ...(generalData && {
        brandId: generalData.brandId,
        agentId: generalData.agentId,
        carNameId: generalData.carNameId,
        gradeId: generalData.gradeId,
        yearId: generalData.yearId,
      }),
      ...(specificData && {
        chassis: specificData.chassis,
        internalColors: specificData.internalColors,
        externalColors: specificData.externalColors,
        priceCash: specificData.priceCash,
        priceFinance: specificData.priceFinance,
        status: specificData.status as "available" | "reserved" | "sold" | "maintenance" | undefined,
        reservedBy: specificData.reservedBy,
        engine_capacity: specificData.engine_capacity,
        transmission: specificData.transmission,
        fuel_capacity: specificData.fuel_capacity,
        seat_type: specificData.seat_type,
        location: specificData.location,
      }),
      images: data.images,
      existingImagesToKeep: data.existingImagesToKeep,
      description: data.description,
    };

    try {
      await updateCar({ id: carId, payload });
      toast.success("تم تحديث السيارة بنجاح");
    } catch (error) {
      // Error is handled by the hook (toast notification)
      console.error("Error updating car:", error);
    }
  };

  const handlePreviousFromStep3 = (data: ImagesAndDescriptionFormData & { existingImagesToKeep?: string[] }) => {
    setImagesAndDescriptionData(data);
    setCurrentStep(2);
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="تعديل السيارة"
        description="يمكنك تعديل بيانات السيارة من هنا."
        actions={[
          {
            label: "رجوع",
            icon: ArrowLeft,
            onClick: () => router.back(),
            variant: "secondary" as const,
          },
        ]}
      />
      
      <div className="bg-card border border-border rounded-lg p-6">
        <Stepper steps={steps} currentStep={currentStep} />
        
        <div className="mt-6">
          {currentStep === 1 && (
            <GeneralDataStep
              defaultValues={generalDataDefaultValues}
              onSubmit={handleGeneralDataSubmit}
              initialSelectedBrand={initialSelectedBrand}
              initialSelectedAgent={initialSelectedAgent}
              initialSelectedCarName={initialSelectedCarName}
              initialSelectedGrade={initialSelectedGrade}
              initialSelectedYear={initialSelectedYear}
            />
          )}
          {currentStep === 2 && (
            <SpecificDataStep
              defaultValues={specificDataDefaultValues}
              onSubmit={handleSpecificDataSubmit}
              onPrevious={handlePreviousFromStep2}
            />
          )}
          {currentStep === 3 && (
            <ImagesAndDescriptionStep
              defaultValues={imagesAndDescriptionDefaultValues}
              onSubmit={handleImagesAndDescriptionSubmit}
              existingImages={car.images}
              onPrevious={handlePreviousFromStep3}
              isSubmitting={isUpdating}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default EditCarTemplate;

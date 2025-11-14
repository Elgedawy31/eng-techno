"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Stepper, StepInterface } from "@/components/shared/Stepper";
import GeneralDataStep from "@/features/cars/components/steps/GeneralDataStep";
import SpecificDataStep from "@/features/cars/components/steps/SpecificDataStep";
import ImagesAndDescriptionStep from "@/features/cars/components/steps/ImagesAndDescriptionStep";
import { useCars } from "@/features/cars/hooks/useCar";
import type { GeneralDataFormData, SpecificDataFormData, ImagesAndDescriptionFormData } from "@/features/cars/schemas/car.schema";
import type { CreateCarPayload } from "@/features/cars/types/car.types";
import type { OptionType } from "@/types/api.types";
import { ArrowLeft } from "lucide-react";

function NewCarTemplate() {
  const router = useRouter();
  const { createCar, isCreating } = useCars();
  const [currentStep, setCurrentStep] = useState(1);
  const [generalData, setGeneralData] = useState<GeneralDataFormData | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    brand?: OptionType | null;
    agent?: OptionType | null;
    carName?: OptionType | null;
    grade?: OptionType | null;
    year?: OptionType | null;
  } | null>(null);
  const [specificData, setSpecificData] = useState<SpecificDataFormData | null>(null);
  const [imagesAndDescriptionData, setImagesAndDescriptionData] = useState<ImagesAndDescriptionFormData | null>(null);

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

  const handleGeneralDataSubmit = (data: GeneralDataFormData, selectedOptions?: {
    brand?: OptionType | null;
    agent?: OptionType | null;
    carName?: OptionType | null;
    grade?: OptionType | null;
    year?: OptionType | null;
  }) => {
    setGeneralData(data);
    setSelectedOptions(selectedOptions || null);
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
    if (!generalData || !specificData) {
      console.error("Missing required data");
      return;
    }

    // Combine all data into CreateCarPayload
    const payload: CreateCarPayload = {
      brandId: generalData.brandId,
      agentId: generalData.agentId,
      carNameId: generalData.carNameId,
      gradeId: generalData.gradeId,
      yearId: generalData.yearId,
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
      images: data.images,
      description: data.description,
    };

    try {
      await createCar(payload);
      router.push("/dashboard/cars");
    } catch (error) {
      // Error is handled by the hook (toast notification)
      console.error("Error creating car:", error);
    }
  };

  const handlePreviousFromStep3 = (data: ImagesAndDescriptionFormData) => {
    setImagesAndDescriptionData(data);
    setCurrentStep(2);
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="إضافة سيارة جديدة"
        description="يمكنك إضافة سيارة جديدة من هنا."
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
              defaultValues={generalData || undefined}
              onSubmit={handleGeneralDataSubmit}
              initialSelectedBrand={selectedOptions?.brand}
              initialSelectedAgent={selectedOptions?.agent}
              initialSelectedCarName={selectedOptions?.carName}
              initialSelectedGrade={selectedOptions?.grade}
              initialSelectedYear={selectedOptions?.year}
            />
          )}
          {currentStep === 2 && (
            <SpecificDataStep
              defaultValues={specificData || undefined}
              onSubmit={handleSpecificDataSubmit}
              onPrevious={handlePreviousFromStep2}
            />
          )}
          {currentStep === 3 && (
            <ImagesAndDescriptionStep
              defaultValues={imagesAndDescriptionData || undefined}
              onSubmit={handleImagesAndDescriptionSubmit}
              onPrevious={handlePreviousFromStep3}
              isSubmitting={isCreating}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default NewCarTemplate;

"use client";

import { useState, useEffect, startTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generalDataSchema, type GeneralDataFormData } from "@/features/cars/schemas/car.schema";
import { UiAutocomplete } from "@/components/shared/uiAutoComplete/UiAutocomplete";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { AddBrandDialog } from "../AddBrandDialog";
import { AddAgentDialog } from "../AddAgentDialog";
import { AddCarNameDialog } from "../AddCarNameDialog";
import { AddGradeDialog } from "../AddGradeDialog";
import { AddYearDialog } from "../AddYearDialog";
import { useQueryClient } from "@tanstack/react-query";
import { type OptionType } from "@/types/api.types";

interface GeneralDataStepProps {
  defaultValues?: Partial<GeneralDataFormData>;
  onSubmit: (data: GeneralDataFormData, selectedOptions?: {
    brand?: OptionType | null;
    agent?: OptionType | null;
    carName?: OptionType | null;
    grade?: OptionType | null;
    year?: OptionType | null;
  }) => void;
  initialSelectedBrand?: OptionType | null;
  initialSelectedAgent?: OptionType | null;
  initialSelectedCarName?: OptionType | null;
  initialSelectedGrade?: OptionType | null;
  initialSelectedYear?: OptionType | null;
}

function GeneralDataStep({ defaultValues, onSubmit, initialSelectedBrand, initialSelectedAgent, initialSelectedCarName, initialSelectedGrade, initialSelectedYear }: GeneralDataStepProps) {
  const [selectedBrand, setSelectedBrand] = useState<OptionType | null>(initialSelectedBrand || null);
  const [selectedAgent, setSelectedAgent] = useState<OptionType | null>(initialSelectedAgent || null);
  const [selectedCarName, setSelectedCarName] = useState<OptionType | null>(initialSelectedCarName || null);
  const [selectedGrade, setSelectedGrade] = useState<OptionType | null>(initialSelectedGrade || null);
  const [selectedYear, setSelectedYear] = useState<OptionType | null>(initialSelectedYear || null);
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [isCarNameDialogOpen, setIsCarNameDialogOpen] = useState(false);
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<GeneralDataFormData>({
    resolver: zodResolver(generalDataSchema),
    defaultValues: defaultValues || {
      brandId: "",
      agentId: "",
      carNameId: "",
      gradeId: "",
      yearId: "",
    },
  });

  // Restore form data when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset({
        brandId: defaultValues.brandId || "",
        agentId: defaultValues.agentId || "",
        carNameId: defaultValues.carNameId || "",
        gradeId: defaultValues.gradeId || "",
        yearId: defaultValues.yearId || "",
      });
    } else {
      reset({
        brandId: "",
        agentId: "",
        carNameId: "",
        gradeId: "",
        yearId: "",
      });
    }
  }, [defaultValues, reset]);

  // Initialize selectedBrand, selectedAgent, selectedCarName, selectedGrade, and selectedYear from props
  // If initialSelected props are not provided but defaultValues are, restore from defaultValues
  useEffect(() => {
    startTransition(() => {
      // Use initialSelected props if provided, otherwise try to restore from defaultValues
      if (initialSelectedBrand !== undefined) {
        setSelectedBrand(initialSelectedBrand);
      } else if (defaultValues?.brandId) {
        // If we have a brandId but no initialSelectedBrand, set a placeholder
        // The UiAutocomplete will handle fetching and displaying the correct option
        setSelectedBrand({ id: defaultValues.brandId, name: "" });
      } else {
        setSelectedBrand(null);
      }

      if (initialSelectedAgent !== undefined) {
        setSelectedAgent(initialSelectedAgent);
      } else if (defaultValues?.agentId) {
        setSelectedAgent({ id: defaultValues.agentId, name: "" });
      } else {
        setSelectedAgent(null);
      }

      if (initialSelectedCarName !== undefined) {
        setSelectedCarName(initialSelectedCarName);
      } else if (defaultValues?.carNameId) {
        setSelectedCarName({ id: defaultValues.carNameId, name: "" });
      } else {
        setSelectedCarName(null);
      }

      if (initialSelectedGrade !== undefined) {
        setSelectedGrade(initialSelectedGrade);
      } else if (defaultValues?.gradeId) {
        setSelectedGrade({ id: defaultValues.gradeId, name: "" });
      } else {
        setSelectedGrade(null);
      }

      if (initialSelectedYear !== undefined) {
        setSelectedYear(initialSelectedYear);
      } else if (defaultValues?.yearId) {
        setSelectedYear({ id: defaultValues.yearId, name: "" });
      } else {
        setSelectedYear(null);
      }
    });
  }, [defaultValues, initialSelectedBrand, initialSelectedAgent, initialSelectedCarName, initialSelectedGrade, initialSelectedYear]);

  // Clear agent, car name, grade, and year when brand changes
  useEffect(() => {
    if (!selectedBrand) {
      startTransition(() => {
        setSelectedAgent(null);
        setSelectedCarName(null);
        setSelectedGrade(null);
        setSelectedYear(null);
      });
      setValue("agentId", "");
      setValue("carNameId", "");
      setValue("gradeId", "");
      setValue("yearId", "");
    }
  }, [selectedBrand, setValue]);

  // Clear grade and year when car name changes
  useEffect(() => {
    if (!selectedCarName) {
      startTransition(() => {
        setSelectedGrade(null);
        setSelectedYear(null);
      });
      setValue("gradeId", "");
      setValue("yearId", "");
    }
  }, [selectedCarName, setValue]);

  // Clear year when grade changes
  useEffect(() => {
    if (!selectedGrade) {
      startTransition(() => {
        setSelectedYear(null);
      });
      setValue("yearId", "");
    }
  }, [selectedGrade, setValue]);

  const handleFormSubmit = (data: GeneralDataFormData) => {
    onSubmit(data, {
      brand: selectedBrand,
      agent: selectedAgent,
      carName: selectedCarName,
      grade: selectedGrade,
      year: selectedYear,
    });
  };

  const handleAddBrandClick = () => {
    setIsBrandDialogOpen(true);
  };

  const handleBrandDialogChange = (isOpen: boolean) => {
    setIsBrandDialogOpen(isOpen);
  };

  const handleBrandCreated = (brand: { id: string; name: string }) => {
    // Set the newly created brand as selected
    setSelectedBrand({
      id: brand.id,
      name: brand.name,
    });

    // Update the form field
    setValue("brandId", brand.id);

    // Invalidate all paginatedSearch queries for the brands endpoint
    queryClient.invalidateQueries({
      queryKey: ["paginatedSearch", "/brands"],
      exact: false,
    });

    // Also invalidate general brands queries
    queryClient.invalidateQueries({ queryKey: ["brands"] });
  };

  const handleAddAgentClick = () => {
    setIsAgentDialogOpen(true);
  };

  const handleAgentDialogChange = (isOpen: boolean) => {
    setIsAgentDialogOpen(isOpen);
  };

  const handleAgentCreated = (agent: { id: string; name: string }) => {
    // Set the newly created agent as selected
    setSelectedAgent({
      id: agent.id,
      name: agent.name,
    });

    // Update the form field
    setValue("agentId", agent.id);

    // Invalidate all paginatedSearch queries for the agents endpoint
    queryClient.invalidateQueries({
      queryKey: ["paginatedSearch", "/agents"],
      exact: false,
    });

    // Also invalidate general agents queries
    queryClient.invalidateQueries({ queryKey: ["agents"] });
  };

  const handleAddCarNameClick = () => {
    setIsCarNameDialogOpen(true);
  };

  const handleCarNameDialogChange = (isOpen: boolean) => {
    setIsCarNameDialogOpen(isOpen);
  };

  const handleCarNameCreated = (carName: { id: string; name: string }) => {
    // Set the newly created car name as selected
    setSelectedCarName({
      id: carName.id,
      name: carName.name,
    });

    // Update the form field
    setValue("carNameId", carName.id);

    // Invalidate all paginatedSearch queries for the car names endpoint
    queryClient.invalidateQueries({
      queryKey: ["paginatedSearch", "/car-names"],
      exact: false,
    });

    // Also invalidate general car names queries
    queryClient.invalidateQueries({ queryKey: ["carNames"] });
  };

  const handleAddGradeClick = () => {
    setIsGradeDialogOpen(true);
  };

  const handleGradeDialogChange = (isOpen: boolean) => {
    setIsGradeDialogOpen(isOpen);
  };

  const handleGradeCreated = (grade: { id: string; name: string }) => {
    // Set the newly created grade as selected
    setSelectedGrade({
      id: grade.id,
      name: grade.name,
    });

    // Update the form field
    setValue("gradeId", grade.id);

    // Invalidate all paginatedSearch queries for the grades endpoint
    queryClient.invalidateQueries({
      queryKey: ["paginatedSearch", "/grades"],
      exact: false,
    });

    // Also invalidate general grades queries
    queryClient.invalidateQueries({ queryKey: ["grades"] });
  };

  const handleAddYearClick = () => {
    setIsYearDialogOpen(true);
  };

  const handleYearDialogChange = (isOpen: boolean) => {
    setIsYearDialogOpen(isOpen);
  };

  const handleYearCreated = (year: { id: string; value: number }) => {
    // Set the newly created year as selected
    setSelectedYear({
      id: year.id,
      name: year.value.toString(), // Years use value instead of name
    });

    // Update the form field
    setValue("yearId", year.id);

    // Invalidate all paginatedSearch queries for the years endpoint
    queryClient.invalidateQueries({
      queryKey: ["paginatedSearch", "/years"],
      exact: false,
    });

    // Also invalidate general years queries
    queryClient.invalidateQueries({ queryKey: ["years"] });
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand Selection */}
          <div className="space-y-2">
            <Label htmlFor="brandId">
              الماركة <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="brandId"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <UiAutocomplete
                      value={selectedBrand}
                      endpoint="/brands"
                      nameKey="name"
                      idKey="_id"
                      placeholder="اختر الماركة"
                      triggerOnFocus
                      onChange={(selected) => {
                        field.onChange(selected?.id.toString() || "");
                        setSelectedBrand(selected);
                        // Clear car name, grade, and year when brand changes
                        if (selectedCarName) {
                          setSelectedCarName(null);
                          setValue("carNameId", "");
                        }
                        if (selectedGrade) {
                          setSelectedGrade(null);
                          setValue("gradeId", "");
                        }
                        if (selectedYear) {
                          setSelectedYear(null);
                          setValue("yearId", "");
                        }
                      }}
                      onInputChange={(value) => {
                        if (!value) {
                          field.onChange("");
                          setSelectedBrand(null);
                        }
                      }}
                      className={errors.brandId ? "border-destructive" : ""}
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    className="p-0"
                    onClick={handleAddBrandClick}
                    title="إضافة ماركة جديدة"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
            {errors.brandId && (
              <p className="text-sm text-destructive" role="alert">
                {errors.brandId.message}
              </p>
            )}
          </div>

          {/* Agent Selection */}
          <div className="space-y-2">
            <Label htmlFor="agentId">
              الوكيل
            </Label>
            <Controller
              name="agentId"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <UiAutocomplete
                      value={selectedAgent}
                      endpoint="/agents"
                      nameKey="name"
                      idKey="_id"
                      placeholder="اختر الوكيل"
                      triggerOnFocus
                      disabled={!selectedBrand}
                      additionalParams={
                        selectedBrand
                          ? { brandId: selectedBrand.id.toString() }
                          : undefined
                      }
                      onChange={(selected) => {
                        field.onChange(selected?.id.toString() || "");
                        setSelectedAgent(selected);
                      }}
                      onInputChange={(value) => {
                        if (!value) {
                          field.onChange("");
                          setSelectedAgent(null);
                        }
                      }}
                      className={errors.agentId ? "border-destructive" : ""}
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    className="p-0"
                    onClick={handleAddAgentClick}
                    title="إضافة وكيل جديد"
                    disabled={!selectedBrand}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
            {errors.agentId && (
              <p className="text-sm text-destructive" role="alert">
                {errors.agentId.message}
              </p>
            )}
          </div>

          {/* Car Name Selection */}
          <div className="space-y-2">
            <Label htmlFor="carNameId">
              اسم السيارة <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="carNameId"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <UiAutocomplete
                      value={selectedCarName}
                      endpoint="/car-names"
                      nameKey="name"
                      idKey="_id"
                      placeholder="اختر اسم السيارة"
                      triggerOnFocus
                      disabled={!selectedBrand}
                      additionalParams={
                        selectedBrand
                          ? { brandId: selectedBrand.id.toString() }
                          : undefined
                      }
                      onChange={(selected) => {
                        field.onChange(selected?.id.toString() || "");
                        setSelectedCarName(selected);
                        // Clear grade when car name changes
                        if (selectedGrade) {
                          setSelectedGrade(null);
                          setValue("gradeId", "");
                        }
                      }}
                      onInputChange={(value) => {
                        if (!value) {
                          field.onChange("");
                          setSelectedCarName(null);
                        }
                      }}
                      className={errors.carNameId ? "border-destructive" : ""}
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    className="p-0"
                    onClick={handleAddCarNameClick}
                    title="إضافة اسم سيارة جديد"
                    disabled={!selectedBrand}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
            {errors.carNameId && (
              <p className="text-sm text-destructive" role="alert">
                {errors.carNameId.message}
              </p>
            )}
          </div>

          {/* Grade Selection */}
          <div className="space-y-2">
            <Label htmlFor="gradeId">
              الفئة <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="gradeId"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <UiAutocomplete
                      value={selectedGrade}
                      endpoint="/grades"
                      nameKey="name"
                      idKey="_id"
                      placeholder="اختر الفئة"
                      triggerOnFocus
                      disabled={!selectedCarName}
                      additionalParams={
                        selectedCarName
                          ? { carNameId: selectedCarName.id.toString() }
                          : undefined
                      }
                      onChange={(selected) => {
                        field.onChange(selected?.id.toString() || "");
                        setSelectedGrade(selected);
                        // Clear year when grade changes
                        if (selectedYear) {
                          setSelectedYear(null);
                          setValue("yearId", "");
                        }
                      }}
                      onInputChange={(value) => {
                        if (!value) {
                          field.onChange("");
                          setSelectedGrade(null);
                        }
                      }}
                      className={errors.gradeId ? "border-destructive" : ""}
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    className="p-0"
                    onClick={handleAddGradeClick}
                    title="إضافة درجة جديدة"
                    disabled={!selectedCarName}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
            {errors.gradeId && (
              <p className="text-sm text-destructive" role="alert">
                {errors.gradeId.message}
              </p>
            )}
          </div>

          {/* Year Selection */}
          <div className="space-y-2">
            <Label htmlFor="yearId">
              السنة <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="yearId"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <UiAutocomplete
                      value={selectedYear}
                      endpoint="/years"
                      nameKey="value"
                      idKey="_id"
                      placeholder="اختر السنة"
                      triggerOnFocus
                      disabled={!selectedGrade}
                      additionalParams={
                        selectedGrade
                          ? { gradeId: selectedGrade.id.toString() }
                          : undefined
                      }
                      onChange={(selected) => {
                        field.onChange(selected?.id.toString() || "");
                        setSelectedYear(selected);
                      }}
                      onInputChange={(value) => {
                        if (!value) {
                          field.onChange("");
                          setSelectedYear(null);
                        }
                      }}
                      className={errors.yearId ? "border-destructive" : ""}
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    className="p-0"
                    onClick={handleAddYearClick}
                    title="إضافة سنة جديدة"
                    disabled={!selectedGrade}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
            {errors.yearId && (
              <p className="text-sm text-destructive" role="alert">
                {errors.yearId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit">التالي</Button>
        </div>
      </form>

      {/* Brand Creation Dialog */}
      <AddBrandDialog
        open={isBrandDialogOpen}
        onOpenChange={handleBrandDialogChange}
        onBrandCreated={handleBrandCreated}
      />

      {/* Agent Creation Dialog */}
      <AddAgentDialog
        open={isAgentDialogOpen}
        onOpenChange={handleAgentDialogChange}
        onAgentCreated={handleAgentCreated}
        selectedBrand={selectedBrand}
      />

      {/* Car Name Creation Dialog */}
      <AddCarNameDialog
        open={isCarNameDialogOpen}
        onOpenChange={handleCarNameDialogChange}
        onCarNameCreated={handleCarNameCreated}
        selectedBrand={selectedBrand}
      />

      {/* Grade Creation Dialog */}
      <AddGradeDialog
        open={isGradeDialogOpen}
        onOpenChange={handleGradeDialogChange}
        onGradeCreated={handleGradeCreated}
        selectedCarName={selectedCarName}
      />

      {/* Year Creation Dialog */}
      <AddYearDialog
        open={isYearDialogOpen}
        onOpenChange={handleYearDialogChange}
        onYearCreated={handleYearCreated}
        selectedGrade={selectedGrade}
      />
    </>
  );
}

export default GeneralDataStep;

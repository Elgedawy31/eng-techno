"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { CAR_STATUSES, type CarStatus } from "../types/car.types";
import type { CarFilters } from "../hooks/useCar";
import type { OptionType } from "@/types/api.types";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState, startTransition } from "react";
import { UiAutocomplete } from "@/components/shared/uiAutoComplete/UiAutocomplete";

interface CarsFilterProps {
  filters: CarFilters;
  onChange: (changes: Partial<CarFilters>) => void;
  onReset?: () => void;
  className?: string;
  disabled?: boolean;
}

export function CarsFilter({ filters, onChange, onReset, className, disabled = false }: CarsFilterProps) {
  // Local selected options for UiAutocomplete
  const [selectedBrand, setSelectedBrand] = useState<OptionType | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<OptionType | null>(null);
  const [selectedCarName, setSelectedCarName] = useState<OptionType | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<OptionType | null>(null);
  const [selectedYear, setSelectedYear] = useState<OptionType | null>(null);
  // Local state for price sliders
  const [cashRange, setCashRange] = useState<[number, number]>([
    filters.priceCashMin ?? 0,
    filters.priceCashMax ?? 1000000,
  ]);
  const [financeRange, setFinanceRange] = useState<[number, number]>([
    filters.priceFinanceMin ?? 0,
    filters.priceFinanceMax ?? 1000000,
  ]);

  const statusOptions = useMemo(() => CAR_STATUSES, []);

  // Sync local inputs when filters are reset externally
  useEffect(() => {
    startTransition(() => {
      setCashRange([
        filters.priceCashMin ?? 0,
        filters.priceCashMax ?? 1000000,
      ]);
      setFinanceRange([
        filters.priceFinanceMin ?? 0,
        filters.priceFinanceMax ?? 1000000,
      ]);
    });
  }, [filters.priceCashMin, filters.priceCashMax, filters.priceFinanceMin, filters.priceFinanceMax]);

  // When filters identities reset elsewhere, clear local selections
  useEffect(() => {
    startTransition(() => {
      if (!filters.brandId) setSelectedBrand(null);
      if (!filters.agentId) setSelectedAgent(null);
      if (!filters.carNameId) setSelectedCarName(null);
      if (!filters.gradeId) setSelectedGrade(null);
      if (!filters.yearId) setSelectedYear(null);
    });
  }, [filters.brandId, filters.agentId, filters.carNameId, filters.gradeId, filters.yearId]);

  const handleBrandChange = (option: OptionType | null) => {
    setSelectedBrand(option);
    onChange({
      brandId: option?.id?.toString() || undefined,
      agentId: undefined,
      carNameId: undefined,
      gradeId: undefined,
      yearId: undefined,
    });
    setSelectedAgent(null);
    setSelectedCarName(null);
    setSelectedGrade(null);
    setSelectedYear(null);
  };

  const handleAgentChange = (option: OptionType | null) => {
    setSelectedAgent(option);
    onChange({
      agentId: option?.id?.toString() || undefined,
    });
  };

  const handleCarNameChange = (option: OptionType | null) => {
    setSelectedCarName(option);
    onChange({
      carNameId: option?.id?.toString() || undefined,
      gradeId: undefined,
      yearId: undefined,
    });
    setSelectedGrade(null);
    setSelectedYear(null);
  };

  const handleGradeChange = (option: OptionType | null) => {
    setSelectedGrade(option);
    onChange({
      gradeId: option?.id?.toString() || undefined,
      yearId: undefined,
    });
    setSelectedYear(null);
  };

  const handleYearChange = (option: OptionType | null) => {
    setSelectedYear(option);
    onChange({
      yearId: option?.id?.toString() || undefined,
    });
  };

  const handleToggleStatus = (status: CarStatus) => {
    // Exclusive checkbox behavior: only one status at a time
    onChange({
      status: filters.status === status ? undefined : status,
    });
  };

  return (
    <aside className={cn("w-64 shrink-0", className)}>
      <Card className="p-4 sticky top-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">الفلاتر</h3>
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            onClick={onReset}
            title="إعادة التعيين"
            disabled={disabled}
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">الماركة</label>
            <UiAutocomplete
            triggerOnFocus
              endpoint="/brands"
              value={selectedBrand}
              onChange={handleBrandChange}
              placeholder="اختر الماركة"
              idKey="_id"
              nameKey="name"
              disabled={disabled}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">الوكيل</label>
            <UiAutocomplete
            triggerOnFocus
              endpoint="/agents"
              value={selectedAgent}
              onChange={handleAgentChange}
              placeholder={!filters.brandId ? "اختر الماركة أولاً" : "اختر الوكيل"}
              idKey="_id"
              nameKey="name"
              disabled={disabled || !filters.brandId}
              additionalParams={{ brandId: filters.brandId }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">اسم السيارة</label>
            <UiAutocomplete
            triggerOnFocus
              endpoint="/car-names"
              value={selectedCarName}
              onChange={handleCarNameChange}
              placeholder={!filters.brandId ? "اختر الماركة أولاً" : "اختر اسم السيارة"}
              idKey="_id"
              nameKey="name"
              disabled={disabled || !filters.brandId}
              additionalParams={filters.brandId ? { brandId: filters.brandId } : undefined}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">الدرجة</label>
            <UiAutocomplete
            triggerOnFocus
              endpoint="/grades"
              value={selectedGrade}
              onChange={handleGradeChange}
              placeholder={!filters.carNameId ? "اختر اسم السيارة أولاً" : "اختر الدرجة"}
              idKey="_id"
              nameKey="name"
              disabled={disabled || !filters.carNameId}
              additionalParams={{ carNameId: filters.carNameId }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">السنة</label>
            <UiAutocomplete
            triggerOnFocus
              endpoint="/years"
              value={selectedYear}
              onChange={handleYearChange}
              placeholder={!filters.gradeId ? "اختر الدرجة أولاً" : "اختر السنة"}
              idKey="_id"
              nameKey="value"
              disabled={disabled || !filters.gradeId}
              additionalParams={{ gradeId: filters.gradeId }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">الحالة</label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((st) => (
                <label key={st} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                  <Checkbox
                    checked={filters.status === st}
                    onCheckedChange={() => handleToggleStatus(st)}
                    disabled={disabled}
                  />
                  <span>
                    {st === "available" ? "متاح" :
                     st === "reserved" ? "محجوز" :
                     st === "sold" ? "مباع" :
                     st === "maintenance" ? "صيانة" : st}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">السعر النقدي (ر.س)</label>
              <div className="text-xs text-muted-foreground">
                {cashRange[0].toLocaleString()} - {cashRange[1].toLocaleString()}
              </div>
            </div>
            <Slider
              value={cashRange}
              onValueChange={(v) => {
                if (Array.isArray(v) && v.length === 2) {
                  setCashRange([v[0], v[1]]);
                }
              }}
              onValueCommit={(v) => {
                if (Array.isArray(v) && v.length === 2) {
                  onChange({
                    priceCashMin: v[0],
                    priceCashMax: v[1],
                  });
                }
              }}
              min={0}
              max={1000000}
              step={500}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">السعر بالتقسيط (ر.س)</label>
              <div className="text-xs text-muted-foreground">
                {financeRange[0].toLocaleString()} - {financeRange[1].toLocaleString()}
              </div>
            </div>
            <Slider
              value={financeRange}
              onValueChange={(v) => {
                if (Array.isArray(v) && v.length === 2) {
                  setFinanceRange([v[0], v[1]]);
                }
              }}
              onValueCommit={(v) => {
                if (Array.isArray(v) && v.length === 2) {
                  onChange({
                    priceFinanceMin: v[0],
                    priceFinanceMax: v[1],
                  });
                }
              }}
              min={0}
              max={1000000}
              step={500}
              disabled={disabled}
            />
          </div>

          {onReset && (
            <Button type="button" variant="outline" className="w-full" onClick={onReset} disabled={disabled}>
              إعادة تعيين الفلاتر
            </Button>
          )}
        </div>
      </Card>
    </aside>
  );
}

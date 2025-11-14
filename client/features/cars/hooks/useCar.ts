"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { carService } from "../services/carService";
import type {
  Pagination,
  CreateCarPayload,
  UpdateCarPayload,
  CarStatus,
} from "../types/car.types";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export interface CarFilters {
  brandId?: string;
  agentId?: string;
  carNameId?: string;
  gradeId?: string;
  yearId?: string;
  status?: CarStatus;
  priceCashMin?: number;
  priceCashMax?: number;
  priceFinanceMin?: number;
  priceFinanceMax?: number;
}

export function useCars(
  initialPage: number = 1,
  limit: number = 10,
  filters?: CarFilters
) {
  const errorShownRef = useRef(false);
  const [page, setPage] = useState(initialPage);
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  // Get all cars query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cars", page, limit, filters],
    queryFn: async ({ signal }) => {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Combine signals
      const combinedSignal = signal || abortController.signal;

      const response = await carService.getAllCars(
        page,
        limit,
        filters,
        combinedSignal
      );

      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch cars");
    },
  });

  // Create car mutation
  const createMutation = useMutation({
    mutationFn: async (payload: CreateCarPayload) => {
      const response = await carService.createCar(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create car");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast.success("تم إضافة السيارة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء إضافة السيارة");
    },
  });

  // Update car mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCarPayload;
    }) => {
      const response = await carService.updateCar(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update car");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء تحديث السيارة");
    },
  });

  // Delete car mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await carService.deleteCar(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete car");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast.success("تم حذف السيارة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء حذف السيارة");
    },
  });

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Show toast error when error occurs
  useEffect(() => {
    if (isError && error && !errorShownRef.current) {
      // Don't show error for aborted requests
      if (
        error instanceof Error &&
        error.name !== "AbortError" &&
        error.message !== "canceled"
      ) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
        errorShownRef.current = true;
      }
    }
    if (!isError) {
      errorShownRef.current = false;
    }
  }, [isError, error]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    // Query data
    cars: data?.cars || [],
    pagination: data?.pagination as Pagination | undefined,
    isLoading,
    isError,
    error,
    refetch,
    page,
    setPage: handlePageChange,

    // Create mutation
    createCar: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    isCreateSuccess: createMutation.isSuccess,

    // Update mutation
    updateCar: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    isUpdateSuccess: updateMutation.isSuccess,

    // Delete mutation
    deleteCar: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    isDeleteSuccess: deleteMutation.isSuccess,
  };
}

// Hook to fetch a single car by ID
export function useCarById(id: string | undefined) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      if (!id) throw new Error("Car ID is required");
      const response = await carService.getCarById(id);
      if (isSuccessResponse(response)) {
        return response.data.car;
      }
      throw new Error(response.message || "Failed to fetch car");
    },
    enabled: !!id,
  });

  return {
    car: data,
    isLoading,
    isError,
    error,
  };
}


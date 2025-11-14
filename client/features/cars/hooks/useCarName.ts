"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { carNameService } from "../services/carNameService";
import type {
  Pagination,
  CreateCarNamePayload,
  UpdateCarNamePayload,
} from "../types/carName.types";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCarNames(
  initialPage: number = 1,
  limit: number = 10,
  agentId?: string,
  enabled: boolean = true
) {
  const errorShownRef = useRef(false);
  const [page, setPage] = useState(initialPage);
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  // Get all car names query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["carNames", page, limit, agentId],
    enabled:enabled,
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

      const response = await carNameService.getAllCarNames(
        page,
        limit,
        agentId,
        combinedSignal
      );

      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch car names");
    },
  });

  // Create car name mutation
  const createMutation = useMutation({
    mutationFn: async (payload: CreateCarNamePayload) => {
      const response = await carNameService.createCarName(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create car name");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carNames"] });
      // Also invalidate paginatedSearch queries for car names autocomplete
      queryClient.invalidateQueries({ queryKey: ["paginatedSearch", "/car-names"] });
      toast.success("تم إضافة اسم السيارة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء إضافة اسم السيارة");
    },
  });

  // Update car name mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCarNamePayload;
    }) => {
      const response = await carNameService.updateCarName(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update car name");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carNames"] });
      toast.success("تم تحديث اسم السيارة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء تحديث اسم السيارة");
    },
  });

  // Delete car name mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await carNameService.deleteCarName(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete car name");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carNames"] });
      toast.success("تم حذف اسم السيارة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء حذف اسم السيارة");
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
    carNames: data?.carNames || [],
    pagination: data?.pagination as Pagination | undefined,
    isLoading,
    isError,
    error,
    refetch,
    page,
    setPage: handlePageChange,

    // Create mutation
    createCarName: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    isCreateSuccess: createMutation.isSuccess,

    // Update mutation
    updateCarName: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    isUpdateSuccess: updateMutation.isSuccess,

    // Delete mutation
    deleteCarName: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    isDeleteSuccess: deleteMutation.isSuccess,
  };
}


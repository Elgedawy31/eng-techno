"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { yearService } from "../services/yearService";
import type {
  Pagination,
  CreateYearPayload,
  UpdateYearPayload,
} from "../types/year.types";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useYears(
  initialPage: number = 1,
  limit: number = 10,
  gradeId?: string,
  enabled: boolean = true
) {
  const errorShownRef = useRef(false);
  const [page, setPage] = useState(initialPage);
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  // Get all years query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["years", page, limit, gradeId],
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

      const response = await yearService.getAllYears(
        page,
        limit,
        gradeId,
        combinedSignal
      );

      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch years");
    },
  });

  // Create year mutation
  const createMutation = useMutation({
    mutationFn: async (payload: CreateYearPayload) => {
      const response = await yearService.createYear(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create year");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["years"] });
      // Also invalidate paginatedSearch queries for years autocomplete
      queryClient.invalidateQueries({ queryKey: ["paginatedSearch", "/years"] });
      toast.success("تم إضافة السنة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء إضافة السنة");
    },
  });

  // Update year mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateYearPayload;
    }) => {
      const response = await yearService.updateYear(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update year");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["years"] });
      toast.success("تم تحديث السنة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء تحديث السنة");
    },
  });

  // Delete year mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await yearService.deleteYear(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete year");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["years"] });
      toast.success("تم حذف السنة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء حذف السنة");
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
    years: data?.years || [],
    pagination: data?.pagination as Pagination | undefined,
    isLoading,
    isError,
    error,
    refetch,
    page,
    setPage: handlePageChange,

    // Create mutation
    createYear: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    isCreateSuccess: createMutation.isSuccess,

    // Update mutation
    updateYear: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    isUpdateSuccess: updateMutation.isSuccess,

    // Delete mutation
    deleteYear: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    isDeleteSuccess: deleteMutation.isSuccess,
  };
}


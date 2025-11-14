"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { brandService } from "../services/brandService";
import type {
  Pagination,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "../types/brand.types";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useBrands(initialPage: number = 1, limit: number = 10, enabled: boolean = true) {
  const errorShownRef = useRef(false);
  const [page, setPage] = useState(initialPage);
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["brands", page, limit],
    enabled,
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

      const response = await brandService.getAllBrands(
        page,
        limit,
        combinedSignal
      );

      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch brands");
    },
  });

  // Create brand mutation
  const createMutation = useMutation({
    mutationFn: async (payload: CreateBrandPayload) => {
      const response = await brandService.createBrand(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create brand");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      // Also invalidate paginatedSearch queries for brands autocomplete
      queryClient.invalidateQueries({ queryKey: ["paginatedSearch", "/brands"] });
      toast.success("تم إضافة الماركة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء إضافة الماركة");
    },
  });

  // Update brand mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBrandPayload;
    }) => {
      const response = await brandService.updateBrand(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update brand");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("تم تحديث الماركة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء تحديث الماركة");
    },
  });

  // Delete brand mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await brandService.deleteBrand(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete brand");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("تم حذف الماركة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء حذف الماركة");
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
    brands: data?.brands || [],
    pagination: data?.pagination as Pagination | undefined,
    isLoading,
    isError,
    error,
    refetch,
    page,
    setPage: handlePageChange,

    // Create mutation
    createBrand: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    isCreateSuccess: createMutation.isSuccess,

    // Update mutation
    updateBrand: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    isUpdateSuccess: updateMutation.isSuccess,

    // Delete mutation
    deleteBrand: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    isDeleteSuccess: deleteMutation.isSuccess,
  };
}


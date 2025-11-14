"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { gradeService } from "../services/gradeService";
import type {
  Pagination,
  CreateGradePayload,
  UpdateGradePayload,
} from "../types/grade.types";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useGrades(
  initialPage: number = 1,
  limit: number = 10,
  carNameId?: string,
  enabled: boolean = true
) {
  const errorShownRef = useRef(false);
  const [page, setPage] = useState(initialPage);
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  // Get all grades query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["grades", page, limit, carNameId],
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

      const response = await gradeService.getAllGrades(
        page,
        limit,
        carNameId,
        combinedSignal
      );

      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch grades");
    },
  });

  // Create grade mutation
  const createMutation = useMutation({
    mutationFn: async (payload: CreateGradePayload) => {
      const response = await gradeService.createGrade(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create grade");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      // Also invalidate paginatedSearch queries for grades autocomplete
      queryClient.invalidateQueries({ queryKey: ["paginatedSearch", "/grades"] });
      toast.success("تم إضافة الدرجة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء إضافة الدرجة");
    },
  });

  // Update grade mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateGradePayload;
    }) => {
      const response = await gradeService.updateGrade(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update grade");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      toast.success("تم تحديث الدرجة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء تحديث الدرجة");
    },
  });

  // Delete grade mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await gradeService.deleteGrade(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete grade");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      toast.success("تم حذف الدرجة بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء حذف الدرجة");
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
    grades: data?.grades || [],
    pagination: data?.pagination as Pagination | undefined,
    isLoading,
    isError,
    error,
    refetch,
    page,
    setPage: handlePageChange,

    // Create mutation
    createGrade: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    isCreateSuccess: createMutation.isSuccess,

    // Update mutation
    updateGrade: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    isUpdateSuccess: updateMutation.isSuccess,

    // Delete mutation
    deleteGrade: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    isDeleteSuccess: deleteMutation.isSuccess,
  };
}


"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coreValueService, type ReorderCoreValuesPayload } from "../services/coreValueService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useReorderCoreValues() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ReorderCoreValuesPayload) => {
      const response = await coreValueService.reorderCoreValues(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to reorder core values");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreValues"] });
      queryClient.invalidateQueries({ queryKey: ["allCoreValues"] });
      toast.success("Core values reordered successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to reorder core values");
    },
  });

  return {
    reorderCoreValues: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


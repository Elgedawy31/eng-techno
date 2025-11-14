"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coreValuesSectionService } from "../services/coreValuesSectionService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useToggleActive() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await coreValuesSectionService.toggleActive(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to toggle core values section status");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreValuesSections"] });
      queryClient.invalidateQueries({ queryKey: ["coreValuesSection"] });
      toast.success("Core values section status updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update core values section status");
    },
  });

  return {
    toggleActive: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


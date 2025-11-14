"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coreValuesSectionService } from "../services/coreValuesSectionService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useDeleteCoreValuesSection() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await coreValuesSectionService.deleteCoreValuesSection(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete core values section");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreValuesSections"] });
      queryClient.invalidateQueries({ queryKey: ["coreValuesSection"] });
      toast.success("Core values section deleted successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to delete core values section");
    },
  });

  return {
    deleteCoreValuesSection: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


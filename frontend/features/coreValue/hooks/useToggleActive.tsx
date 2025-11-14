"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coreValueService } from "../services/coreValueService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useToggleActive() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await coreValueService.toggleActive(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to toggle core value status");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreValues"] });
      queryClient.invalidateQueries({ queryKey: ["allCoreValues"] });
      toast.success("Core value status updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update core value status");
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


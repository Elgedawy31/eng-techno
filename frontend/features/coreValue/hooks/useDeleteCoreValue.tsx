"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coreValueService } from "../services/coreValueService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useDeleteCoreValue() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await coreValueService.deleteCoreValue(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete core value");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreValues"] });
      queryClient.invalidateQueries({ queryKey: ["allCoreValues"] });
      toast.success("Core value deleted successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to delete core value");
    },
  });

  return {
    deleteCoreValue: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coreValueService, type CreateCoreValuePayload } from "../services/coreValueService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateCoreValue() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateCoreValuePayload) => {
      const response = await coreValueService.createCoreValue(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create core value");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreValues"] });
      queryClient.invalidateQueries({ queryKey: ["allCoreValues"] });
      toast.success("Core value created successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to create core value");
    },
  });

  return {
    createCoreValue: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coreValuesSectionService, type CreateOrUpdateCoreValuesSectionPayload } from "../services/coreValuesSectionService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateOrUpdateCoreValuesSection() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrUpdateCoreValuesSectionPayload) => {
      const response = await coreValuesSectionService.createOrUpdateCoreValuesSection(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create or update core values section");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreValuesSections"] });
      queryClient.invalidateQueries({ queryKey: ["coreValuesSection"] });
      toast.success("Core values section saved successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to save core values section");
    },
  });

  return {
    createOrUpdateCoreValuesSection: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


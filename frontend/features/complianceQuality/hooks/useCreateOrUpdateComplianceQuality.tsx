"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { complianceQualityService, type CreateOrUpdateComplianceQualityPayload } from "../services/complianceQualityService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateOrUpdateComplianceQuality() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrUpdateComplianceQualityPayload) => {
      const response = await complianceQualityService.createOrUpdateComplianceQuality(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create or update compliance & quality section");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complianceQualities"] });
      queryClient.invalidateQueries({ queryKey: ["complianceQuality"] });
      toast.success("Compliance & quality section saved successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to save compliance & quality section");
    },
  });

  return {
    createOrUpdateComplianceQuality: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


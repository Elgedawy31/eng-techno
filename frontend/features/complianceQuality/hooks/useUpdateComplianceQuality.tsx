"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { complianceQualityService, type UpdateComplianceQualityPayload } from "../services/complianceQualityService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateComplianceQuality() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateComplianceQualityPayload;
    }) => {
      const response = await complianceQualityService.updateComplianceQuality(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update compliance & quality section");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complianceQualities"] });
      queryClient.invalidateQueries({ queryKey: ["complianceQuality"] });
      toast.success("Compliance & quality section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update compliance & quality section");
    },
  });

  return {
    updateComplianceQuality: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


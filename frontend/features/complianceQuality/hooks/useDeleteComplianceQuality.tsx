"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { complianceQualityService } from "../services/complianceQualityService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useDeleteComplianceQuality() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await complianceQualityService.deleteComplianceQuality(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete compliance & quality section");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complianceQualities"] });
      queryClient.invalidateQueries({ queryKey: ["complianceQuality"] });
      toast.success("Compliance & quality section deleted successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to delete compliance & quality section");
    },
  });

  return {
    deleteComplianceQuality: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


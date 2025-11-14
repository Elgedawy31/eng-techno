"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coreValuesSectionService, type UpdateCoreValuesSectionPayload } from "../services/coreValuesSectionService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateCoreValuesSection() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCoreValuesSectionPayload;
    }) => {
      const response = await coreValuesSectionService.updateCoreValuesSection(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update core values section");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreValuesSections"] });
      queryClient.invalidateQueries({ queryKey: ["coreValuesSection"] });
      toast.success("Core values section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update core values section");
    },
  });

  return {
    updateCoreValuesSection: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


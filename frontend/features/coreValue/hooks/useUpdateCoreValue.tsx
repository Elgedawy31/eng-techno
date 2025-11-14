"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coreValueService, type UpdateCoreValuePayload } from "../services/coreValueService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateCoreValue() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCoreValuePayload;
    }) => {
      const response = await coreValueService.updateCoreValue(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update core value");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreValues"] });
      queryClient.invalidateQueries({ queryKey: ["allCoreValues"] });
      toast.success("Core value updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update core value");
    },
  });

  return {
    updateCoreValue: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


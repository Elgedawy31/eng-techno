"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { footerService, type CreateOrUpdateFooterPayload } from "../services/footerService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateOrUpdateFooter() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrUpdateFooterPayload) => {
      const response = await footerService.createOrUpdateFooter(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create or update footer");
    },
    onSuccess: () => {
      // Invalidate and refetch footer list
      queryClient.invalidateQueries({ queryKey: ["footers"] });
      queryClient.invalidateQueries({ queryKey: ["footer"] });
      toast.success("Footer saved successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to save footer");
    },
  });

  return {
    createOrUpdateFooter: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


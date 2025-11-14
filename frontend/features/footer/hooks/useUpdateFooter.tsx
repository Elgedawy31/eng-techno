"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { footerService, type UpdateFooterPayload } from "../services/footerService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateFooter() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFooterPayload;
    }) => {
      const response = await footerService.updateFooter(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update footer");
    },
    onSuccess: () => {
      // Invalidate and refetch footer list
      queryClient.invalidateQueries({ queryKey: ["footers"] });
      queryClient.invalidateQueries({ queryKey: ["footer"] });
      toast.success("Footer updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update footer");
    },
  });

  return {
    updateFooter: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


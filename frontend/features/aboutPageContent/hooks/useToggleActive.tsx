"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { aboutPageContentService } from "../services/aboutPageContentService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useToggleActive() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await aboutPageContentService.toggleActive(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to toggle about page content status");
    },
    onSuccess: () => {
      // Invalidate and refetch about page contents list
      queryClient.invalidateQueries({ queryKey: ["aboutPageContents"] });
      queryClient.invalidateQueries({ queryKey: ["aboutPageContent"] });
      toast.success("About page content status updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update about page content status");
    },
  });

  return {
    toggleActive: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


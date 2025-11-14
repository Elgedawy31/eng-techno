"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { aboutPageContentService, type CreateOrUpdateAboutPageContentPayload } from "../services/aboutPageContentService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateOrUpdateAboutPageContent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrUpdateAboutPageContentPayload) => {
      const response = await aboutPageContentService.createOrUpdateAboutPageContent(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create or update about page content");
    },
    onSuccess: () => {
      // Invalidate and refetch about page contents list
      queryClient.invalidateQueries({ queryKey: ["aboutPageContents"] });
      queryClient.invalidateQueries({ queryKey: ["aboutPageContent"] });
      toast.success("About page content saved successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to save about page content");
    },
  });

  return {
    createOrUpdateAboutPageContent: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


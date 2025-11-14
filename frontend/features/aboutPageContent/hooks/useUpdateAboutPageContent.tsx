"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { aboutPageContentService, type UpdateAboutPageContentPayload } from "../services/aboutPageContentService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateAboutPageContent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAboutPageContentPayload;
    }) => {
      const response = await aboutPageContentService.updateAboutPageContent(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update about page content");
    },
    onSuccess: () => {
      // Invalidate and refetch about page contents list
      queryClient.invalidateQueries({ queryKey: ["aboutPageContents"] });
      queryClient.invalidateQueries({ queryKey: ["aboutPageContent"] });
      toast.success("About page content updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update about page content");
    },
  });

  return {
    updateAboutPageContent: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


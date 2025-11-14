"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { aboutService, type CreateOrUpdateAboutPayload } from "../services/aboutService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateOrUpdateAbout() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrUpdateAboutPayload) => {
      const response = await aboutService.createOrUpdateAbout(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create or update about");
    },
    onSuccess: () => {
      // Invalidate and refetch abouts list
      queryClient.invalidateQueries({ queryKey: ["abouts"] });
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("About section saved successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to save about section");
    },
  });

  return {
    createOrUpdateAbout: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


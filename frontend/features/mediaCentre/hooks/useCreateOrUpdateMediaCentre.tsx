"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mediaCentreService, type CreateOrUpdateMediaCentrePayload } from "../services/mediaCentreService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateOrUpdateMediaCentre() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrUpdateMediaCentrePayload) => {
      const response = await mediaCentreService.createOrUpdateMediaCentre(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create or update media centre");
    },
    onSuccess: () => {
      // Invalidate and refetch media centres list
      queryClient.invalidateQueries({ queryKey: ["mediaCentres"] });
      queryClient.invalidateQueries({ queryKey: ["mediaCentre"] });
      toast.success("Media centre section saved successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to save media centre section");
    },
  });

  return {
    createOrUpdateMediaCentre: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


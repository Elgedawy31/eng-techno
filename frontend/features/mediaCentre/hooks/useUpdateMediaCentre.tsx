"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mediaCentreService, type UpdateMediaCentrePayload } from "../services/mediaCentreService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateMediaCentre() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMediaCentrePayload;
    }) => {
      const response = await mediaCentreService.updateMediaCentre(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update media centre");
    },
    onSuccess: () => {
      // Invalidate and refetch media centres list
      queryClient.invalidateQueries({ queryKey: ["mediaCentres"] });
      queryClient.invalidateQueries({ queryKey: ["mediaCentre"] });
      toast.success("Media centre section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update media centre section");
    },
  });

  return {
    updateMediaCentre: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


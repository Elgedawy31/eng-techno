"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mediaCentreService } from "../services/mediaCentreService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useDeleteMediaCentre() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await mediaCentreService.deleteMediaCentre(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete media centre");
    },
    onSuccess: () => {
      // Invalidate and refetch media centres list
      queryClient.invalidateQueries({ queryKey: ["mediaCentres"] });
      queryClient.invalidateQueries({ queryKey: ["mediaCentre"] });
      toast.success("Media centre section deleted successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to delete media centre section");
    },
  });

  return {
    deleteMediaCentre: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


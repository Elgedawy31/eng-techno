"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { aboutPageHeroService } from "../services/aboutPageHeroService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useToggleActive() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await aboutPageHeroService.toggleActive(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to toggle about page hero status");
    },
    onSuccess: () => {
      // Invalidate and refetch about page heroes list
      queryClient.invalidateQueries({ queryKey: ["aboutPageHeroes"] });
      queryClient.invalidateQueries({ queryKey: ["aboutPageHero"] });
      toast.success("About page hero status updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update about page hero status");
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


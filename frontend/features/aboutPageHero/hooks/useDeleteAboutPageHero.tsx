"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { aboutPageHeroService } from "../services/aboutPageHeroService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useDeleteAboutPageHero() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await aboutPageHeroService.deleteAboutPageHero(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete about page hero");
    },
    onSuccess: () => {
      // Invalidate and refetch about page heroes list
      queryClient.invalidateQueries({ queryKey: ["aboutPageHeroes"] });
      queryClient.invalidateQueries({ queryKey: ["aboutPageHero"] });
      toast.success("About page hero deleted successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to delete about page hero");
    },
  });

  return {
    deleteAboutPageHero: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { aboutPageHeroService, type CreateOrUpdateAboutPageHeroPayload } from "../services/aboutPageHeroService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateOrUpdateAboutPageHero() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrUpdateAboutPageHeroPayload) => {
      const response = await aboutPageHeroService.createOrUpdateAboutPageHero(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create or update about page hero");
    },
    onSuccess: () => {
      // Invalidate and refetch about page heroes list
      queryClient.invalidateQueries({ queryKey: ["aboutPageHeroes"] });
      queryClient.invalidateQueries({ queryKey: ["aboutPageHero"] });
      toast.success("About page hero saved successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to save about page hero");
    },
  });

  return {
    createOrUpdateAboutPageHero: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


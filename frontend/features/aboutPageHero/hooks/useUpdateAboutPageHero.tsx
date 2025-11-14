"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { aboutPageHeroService, type UpdateAboutPageHeroPayload } from "../services/aboutPageHeroService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateAboutPageHero() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAboutPageHeroPayload;
    }) => {
      const response = await aboutPageHeroService.updateAboutPageHero(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update about page hero");
    },
    onSuccess: () => {
      // Invalidate and refetch about page heroes list
      queryClient.invalidateQueries({ queryKey: ["aboutPageHeroes"] });
      queryClient.invalidateQueries({ queryKey: ["aboutPageHero"] });
      toast.success("About page hero updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update about page hero");
    },
  });

  return {
    updateAboutPageHero: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


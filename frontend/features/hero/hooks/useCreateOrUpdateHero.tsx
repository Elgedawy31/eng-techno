"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { heroService, type CreateOrUpdateHeroPayload } from "../services/heroService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateOrUpdateHero() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrUpdateHeroPayload) => {
      const response = await heroService.createOrUpdateHero(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create or update hero");
    },
    onSuccess: () => {
      // Invalidate and refetch heroes list
      queryClient.invalidateQueries({ queryKey: ["heroes"] });
      queryClient.invalidateQueries({ queryKey: ["hero"] });
      toast.success("Hero section saved successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to save hero section");
    },
  });

  return {
    createOrUpdateHero: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { heroService, type UpdateHeroPayload } from "../services/heroService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateHero() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateHeroPayload;
    }) => {
      const response = await heroService.updateHero(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update hero");
    },
    onSuccess: () => {
      // Invalidate and refetch heroes list
      queryClient.invalidateQueries({ queryKey: ["heroes"] });
      queryClient.invalidateQueries({ queryKey: ["hero"] });
      toast.success("Hero section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update hero section");
    },
  });

  return {
    updateHero: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { heroService } from "../services/heroService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useDeleteHero() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await heroService.deleteHero(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete hero");
    },
    onSuccess: () => {
      // Invalidate and refetch heroes list
      queryClient.invalidateQueries({ queryKey: ["heroes"] });
      queryClient.invalidateQueries({ queryKey: ["hero"] });
      toast.success("Hero section deleted successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to delete hero section");
    },
  });

  return {
    deleteHero: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


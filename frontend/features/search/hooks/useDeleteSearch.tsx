"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { searchService } from "../services/searchService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useDeleteSearch() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await searchService.deleteSearch(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete search");
    },
    onSuccess: () => {
      // Invalidate and refetch searches list
      queryClient.invalidateQueries({ queryKey: ["searches"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
      toast.success("Search section deleted successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to delete search section");
    },
  });

  return {
    deleteSearch: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { searchService, type CreateOrUpdateSearchPayload } from "../services/searchService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateOrUpdateSearch() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrUpdateSearchPayload) => {
      const response = await searchService.createOrUpdateSearch(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create or update search");
    },
    onSuccess: () => {
      // Invalidate and refetch searches list
      queryClient.invalidateQueries({ queryKey: ["searches"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
      toast.success("Search section saved successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to save search section");
    },
  });

  return {
    createOrUpdateSearch: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { searchService, type UpdateSearchPayload } from "../services/searchService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateSearch() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSearchPayload;
    }) => {
      const response = await searchService.updateSearch(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update search");
    },
    onSuccess: () => {
      // Invalidate and refetch searches list
      queryClient.invalidateQueries({ queryKey: ["searches"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
      toast.success("Search section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update search section");
    },
  });

  return {
    updateSearch: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


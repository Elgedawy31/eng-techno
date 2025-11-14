"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { aboutService, type UpdateAboutPayload } from "../services/aboutService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateAbout() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAboutPayload;
    }) => {
      const response = await aboutService.updateAbout(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update about");
    },
    onSuccess: () => {
      // Invalidate and refetch abouts list
      queryClient.invalidateQueries({ queryKey: ["abouts"] });
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("About section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update about section");
    },
  });

  return {
    updateAbout: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


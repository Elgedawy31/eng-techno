"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventService } from "../services/eventService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useDeleteEventImage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, imagePath }: { id: string; imagePath: string }) => {
      const response = await eventService.deleteEventImage(id, imagePath);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete event image");
    },
    onSuccess: () => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
      toast.success("Event image deleted successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to delete event image");
    },
  });

  return {
    deleteEventImage: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { announcementService, type UpdateAnnouncementPayload } from "../services/announcementService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAnnouncementPayload;
    }) => {
      const response = await announcementService.updateAnnouncement(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update announcement");
    },
    onSuccess: () => {
      // Invalidate and refetch announcements list
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcement"] });
      toast.success("Announcement updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update announcement");
    },
  });

  return {
    updateAnnouncement: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


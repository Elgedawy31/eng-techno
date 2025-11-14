"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { announcementService, type CreateAnnouncementPayload } from "../services/announcementService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateAnnouncementPayload) => {
      const response = await announcementService.createAnnouncement(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create announcement");
    },
    onSuccess: () => {
      // Invalidate and refetch announcements list
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcement"] });
      toast.success("Announcement created successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to create announcement");
    },
  });

  return {
    createAnnouncement: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


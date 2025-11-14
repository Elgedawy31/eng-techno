"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { missionVisionService, type CreateOrUpdateMissionVisionPayload } from "../services/missionVisionService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateOrUpdateMissionVision() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrUpdateMissionVisionPayload) => {
      const response = await missionVisionService.createOrUpdateMissionVision(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create or update mission & vision");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missionVisions"] });
      queryClient.invalidateQueries({ queryKey: ["missionVision"] });
      toast.success("Mission & vision saved successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to save mission & vision");
    },
  });

  return {
    createOrUpdateMissionVision: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


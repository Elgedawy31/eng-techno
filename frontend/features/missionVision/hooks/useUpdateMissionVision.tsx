"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { missionVisionService, type UpdateMissionVisionPayload } from "../services/missionVisionService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateMissionVision() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMissionVisionPayload;
    }) => {
      const response = await missionVisionService.updateMissionVision(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update mission & vision");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missionVisions"] });
      queryClient.invalidateQueries({ queryKey: ["missionVision"] });
      toast.success("Mission & vision updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update mission & vision");
    },
  });

  return {
    updateMissionVision: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


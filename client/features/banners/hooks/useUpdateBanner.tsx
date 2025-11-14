"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bannerService, type UpdateBannerPayload } from "../services/bannerService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBannerPayload;
    }) => {
      const response = await bannerService.updateBanner(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update banner");
    },
    onSuccess: () => {
      // Invalidate and refetch banners list
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("تم تحديث البانر بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء تحديث البانر");
    },
  });

  return {
    updateBanner: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


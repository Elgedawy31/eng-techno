"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bannerService } from "../services/bannerService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await bannerService.deleteBanner(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete banner");
    },
    onSuccess: () => {
      // Invalidate and refetch banners list
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("تم حذف البانر بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء حذف البانر");
    },
  });

  return {
    deleteBanner: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


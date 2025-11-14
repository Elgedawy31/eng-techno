"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clientPartnerService, type ReorderClientPartnersPayload } from "../services/clientPartnerService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useReorderClientPartners() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ReorderClientPartnersPayload) => {
      const response = await clientPartnerService.reorderClientPartners(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to reorder client partners");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientPartners"] });
      queryClient.invalidateQueries({ queryKey: ["allClientPartners"] });
      toast.success("Client partners reordered successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to reorder client partners");
    },
  });

  return {
    reorderClientPartners: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


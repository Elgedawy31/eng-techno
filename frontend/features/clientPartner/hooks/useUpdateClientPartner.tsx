"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clientPartnerService, type UpdateClientPartnerPayload } from "../services/clientPartnerService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateClientPartner() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateClientPartnerPayload;
    }) => {
      const response = await clientPartnerService.updateClientPartner(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update client partner");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientPartners"] });
      queryClient.invalidateQueries({ queryKey: ["allClientPartners"] });
      toast.success("Client partner updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update client partner");
    },
  });

  return {
    updateClientPartner: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


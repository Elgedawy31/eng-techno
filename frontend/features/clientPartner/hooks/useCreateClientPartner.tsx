"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clientPartnerService, type CreateClientPartnerPayload } from "../services/clientPartnerService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateClientPartner() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateClientPartnerPayload) => {
      const response = await clientPartnerService.createClientPartner(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create client partner");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientPartners"] });
      queryClient.invalidateQueries({ queryKey: ["allClientPartners"] });
      toast.success("Client partner created successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to create client partner");
    },
  });

  return {
    createClientPartner: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


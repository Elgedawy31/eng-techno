"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clientPartnerService } from "../services/clientPartnerService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useDeleteClientPartner() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await clientPartnerService.deleteClientPartner(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete client partner");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientPartners"] });
      queryClient.invalidateQueries({ queryKey: ["allClientPartners"] });
      toast.success("Client partner deleted successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to delete client partner");
    },
  });

  return {
    deleteClientPartner: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


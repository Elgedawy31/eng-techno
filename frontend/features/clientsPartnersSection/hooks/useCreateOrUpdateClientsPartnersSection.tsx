"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clientsPartnersSectionService, type CreateOrUpdateClientsPartnersSectionPayload } from "../services/clientsPartnersSectionService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateOrUpdateClientsPartnersSection() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrUpdateClientsPartnersSectionPayload) => {
      const response = await clientsPartnersSectionService.createOrUpdateClientsPartnersSection(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create or update clients & partners section");
    },
    onSuccess: () => {
      // Invalidate and refetch clients & partners sections list
      queryClient.invalidateQueries({ queryKey: ["clientsPartnersSections"] });
      queryClient.invalidateQueries({ queryKey: ["clientsPartnersSection"] });
      toast.success("Clients & partners section saved successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to save clients & partners section");
    },
  });

  return {
    createOrUpdateClientsPartnersSection: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clientsPartnersSectionService, type UpdateClientsPartnersSectionPayload } from "../services/clientsPartnersSectionService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useUpdateClientsPartnersSection() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateClientsPartnersSectionPayload;
    }) => {
      const response = await clientsPartnersSectionService.updateClientsPartnersSection(id, payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update clients & partners section");
    },
    onSuccess: () => {
      // Invalidate and refetch clients & partners sections list
      queryClient.invalidateQueries({ queryKey: ["clientsPartnersSections"] });
      queryClient.invalidateQueries({ queryKey: ["clientsPartnersSection"] });
      toast.success("Clients & partners section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to update clients & partners section");
    },
  });

  return {
    updateClientsPartnersSection: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


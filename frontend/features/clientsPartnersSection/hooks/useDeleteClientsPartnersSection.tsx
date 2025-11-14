"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clientsPartnersSectionService } from "../services/clientsPartnersSectionService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useDeleteClientsPartnersSection() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await clientsPartnersSectionService.deleteClientsPartnersSection(id);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to delete clients & partners section");
    },
    onSuccess: () => {
      // Invalidate and refetch clients & partners sections list
      queryClient.invalidateQueries({ queryKey: ["clientsPartnersSections"] });
      queryClient.invalidateQueries({ queryKey: ["clientsPartnersSection"] });
      toast.success("Clients & partners section deleted successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Failed to delete clients & partners section");
    },
  });

  return {
    deleteClientsPartnersSection: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}


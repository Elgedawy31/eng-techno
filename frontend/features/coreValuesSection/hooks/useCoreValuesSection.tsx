"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { coreValuesSectionService } from "../services/coreValuesSectionService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCoreValuesSection() {
  const errorShownRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["coreValuesSection"],
    queryFn: async ({ signal }) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const combinedSignal = signal || abortController.signal;

      const response = await coreValuesSectionService.getCoreValuesSection(combinedSignal);
      
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch core values section");
    },
  });

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (isError && error && !errorShownRef.current) {
      if (error instanceof Error && error.name !== "AbortError" && error.message !== "canceled") {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
        errorShownRef.current = true;
      }
    }
    if (!isError) {
      errorShownRef.current = false;
    }
  }, [isError, error]);

  return {
    coreValuesSection: data || null,
    isLoading,
    isError,
    error,
    refetch,
  };
}


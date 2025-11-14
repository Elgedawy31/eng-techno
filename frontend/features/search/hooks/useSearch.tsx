"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { searchService } from "../services/searchService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useSearch() {
  const errorShownRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["search"],
    queryFn: async ({ signal }) => {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Combine signals
      const combinedSignal = signal || abortController.signal;

      const response = await searchService.getSearch(combinedSignal);
      
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch search");
    },
  });

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Show toast error when error occurs
  useEffect(() => {
    if (isError && error && !errorShownRef.current) {
      // Don't show error for aborted requests
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
    search: data || null,
    isLoading,
    isError,
    error,
    refetch,
  };
}


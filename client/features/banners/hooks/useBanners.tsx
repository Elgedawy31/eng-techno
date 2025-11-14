"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { bannerService, type Pagination } from "../services/bannerService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useBanners(initialPage: number = 1, limit: number = 10) {
  const errorShownRef = useRef(false);
  const [page, setPage] = useState(initialPage);
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["banners", page, limit],
    queryFn: async () => {
      const response = await bannerService.getAllBanners(page, limit);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch banners");
    },
  });

  // Show toast error when error occurs
  useEffect(() => {
    if (isError && error && !errorShownRef.current) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      errorShownRef.current = true;
    }
    if (!isError) {
      errorShownRef.current = false;
    }
  }, [isError, error]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    banners: data?.banners || [],
    pagination: data?.pagination as Pagination | undefined,
    isLoading,
    isError,
    error,
    refetch,
    page,
    setPage: handlePageChange,
  };
}


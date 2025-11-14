"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService, type Pagination, type UserRole, type Branch } from "../services/userService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export interface UseUsersFilters {
  search?: string;
  role?: UserRole;
  branch?: Branch;
  rating?: number;
}

export function useUsers(
  initialPage: number = 1,
  limit: number = 10,
  filters?: UseUsersFilters
) {
  const errorShownRef = useRef(false);
  const [page, setPage] = useState(initialPage);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", page, limit, filters?.search, filters?.role, filters?.branch, filters?.rating],
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

      const response = await userService.getAllUsers(
        page,
        limit,
        filters?.search,
        filters?.role,
        combinedSignal
      );
      
      if (isSuccessResponse(response)) {
        // Filter by branch and rating on client side if needed
        let filteredUsers = response.data.users;
        
        if (filters?.branch) {
          filteredUsers = filteredUsers.filter(user => user.branch === filters.branch);
        }
        
        if (filters?.rating !== undefined) {
          filteredUsers = filteredUsers.filter(user => user.rating !== undefined && user.rating >= filters.rating!);
        }
        
        return {
          ...response.data,
          users: filteredUsers,
        };
      }
      throw new Error(response.message || "Failed to fetch users");
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.search, filters?.role, filters?.branch, filters?.rating]);

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    users: data?.users || [],
    pagination: data?.pagination as Pagination | undefined,
    isLoading,
    isError,
    error,
    refetch,
    page,
    setPage: handlePageChange,
  };
}


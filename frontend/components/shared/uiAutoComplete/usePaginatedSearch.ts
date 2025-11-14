'use client';

import { useState } from 'react';
import { API_URL } from '@/utils/constants';
import clientAxios from '@/lib/axios/clientAxios';
import { OptionType, ApiSuccessResponse, PaginatedData, Pagination } from '@/types/api.types';
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";

interface UsePaginatedSearchProps {
  endpoint: string;
  pageSize?: number;
  nameKey?: string;
  idKey?: string;
  enabled?: boolean;
  additionalParams?: Record<string, string | number | undefined>;
}

export function usePaginatedSearch({
  endpoint,
  nameKey = 'name',
  idKey = 'id',
  enabled = true,
  additionalParams = {},
}: UsePaginatedSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchOptions = async ({ pageParam = 1 }) => {
    const query = new URLSearchParams({
      page: String(pageParam),
      ...(debouncedSearchTerm ? { search: debouncedSearchTerm } : {}),
      ...Object.fromEntries(
        Object.entries(additionalParams).filter(([, v]) => v !== undefined)
      ),
    });

    const res = await clientAxios.get(
      `${API_URL}${endpoint}?${query.toString()}`
    );
    
    // The API response has pagination inside data
    const response = res.data as ApiSuccessResponse<PaginatedData<Record<string, unknown>>, true>;
    
    // Extract items array from the paginated data (the data object contains both items and pagination)
    const dataKeys = Object.keys(response.data).filter(key => key !== 'pagination');
    const itemsArray = dataKeys.length > 0 
      ? (response.data[dataKeys[0]] as Record<string, unknown>[])
      : [];

    // Get pagination from the data
    const pagination: Pagination | undefined = response.data.pagination;

    const mapped = itemsArray.map((item) => {
      const user = item.user as { name?: string } | undefined;
      return {
        id: item[idKey],
        name: (item[nameKey] as string | undefined) || user?.name || `Item ${item[idKey]}`,
        ...item,
      };
    }) as OptionType[];

    return {
      options: mapped,
      nextPage: pagination && pagination.page && pagination.pages && pagination.page < pagination.pages
        ? pagination.page + 1
        : undefined,
      total_pages: pagination?.pages,
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["paginatedSearch", endpoint, debouncedSearchTerm, additionalParams],
    queryFn: fetchOptions,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPage && lastPage.total_pages && lastPage.nextPage <= lastPage.total_pages) {
        return lastPage.nextPage;
      }
      return undefined;
    },
    enabled: enabled,
    initialPageParam: 1,
  });

  const options: OptionType[] = data?.pages.flatMap((page) => page.options) || [];

  return {
    options,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    isLoading: isLoading || isRefetching,
    handleSearchChange: setSearchTerm,
    searchTerm,
  };
}

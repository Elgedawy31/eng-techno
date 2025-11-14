'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface Search {
  _id: string;
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  logoImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetSearchResponse = ApiResponse<Search | null>;
export type GetAllSearchesResponse = ApiResponse<Search[]>;
export type GetSearchByIdResponse = ApiResponse<Search>;

export interface CreateOrUpdateSearchPayload {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  isActive?: boolean;
  logoImage?: File;
}

export interface UpdateSearchPayload {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  isActive?: boolean;
  logoImage?: File;
}

export type CreateOrUpdateSearchResponse = ApiResponse<Search>;
export type UpdateSearchResponse = ApiResponse<Search>;
export type DeleteSearchResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<Search>;

class SearchService {
  async getSearch(signal?: AbortSignal): Promise<GetSearchResponse> {
    try {
      const response = await clientAxios.get<GetSearchResponse>("/search", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllSearches(signal?: AbortSignal): Promise<GetAllSearchesResponse> {
    try {
      const response = await clientAxios.get<GetAllSearchesResponse>("/search/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getSearchById(id: string): Promise<GetSearchByIdResponse> {
    try {
      const response = await clientAxios.get<GetSearchByIdResponse>(`/search/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createOrUpdateSearch(payload: CreateOrUpdateSearchPayload): Promise<CreateOrUpdateSearchResponse> {
    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("subtitle", payload.subtitle);
      formData.append("placeholder", payload.placeholder);
      formData.append("buttonText", payload.buttonText);
      
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      
      if (payload.logoImage) {
        formData.append("logoImage", payload.logoImage);
      }

      const response = await clientAxios.post<CreateOrUpdateSearchResponse>(
        "/search",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateSearch(
    id: string,
    payload: UpdateSearchPayload
  ): Promise<UpdateSearchResponse> {
    try {
      const formData = new FormData();
      
      if (payload.title) {
        formData.append("title", payload.title);
      }
      if (payload.subtitle) {
        formData.append("subtitle", payload.subtitle);
      }
      if (payload.placeholder) {
        formData.append("placeholder", payload.placeholder);
      }
      if (payload.buttonText) {
        formData.append("buttonText", payload.buttonText);
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.logoImage) {
        formData.append("logoImage", payload.logoImage);
      }

      const response = await clientAxios.put<UpdateSearchResponse>(
        `/search/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteSearch(id: string): Promise<DeleteSearchResponse> {
    try {
      const response = await clientAxios.delete<DeleteSearchResponse>(
        `/search/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/search/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const searchService = new SearchService();


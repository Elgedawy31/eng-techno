'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface CoreValuesSection {
  _id: string;
  label?: string;
  heading: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetCoreValuesSectionResponse = ApiResponse<CoreValuesSection | null>;
export type GetAllCoreValuesSectionsResponse = ApiResponse<CoreValuesSection[]>;
export type GetCoreValuesSectionByIdResponse = ApiResponse<CoreValuesSection>;

export interface CreateOrUpdateCoreValuesSectionPayload {
  label?: string;
  heading: string;
  isActive?: boolean;
}

export interface UpdateCoreValuesSectionPayload {
  label?: string;
  heading?: string;
  isActive?: boolean;
}

export type CreateOrUpdateCoreValuesSectionResponse = ApiResponse<CoreValuesSection>;
export type UpdateCoreValuesSectionResponse = ApiResponse<CoreValuesSection>;
export type DeleteCoreValuesSectionResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<CoreValuesSection>;

class CoreValuesSectionService {
  async getCoreValuesSection(signal?: AbortSignal): Promise<GetCoreValuesSectionResponse> {
    try {
      const response = await clientAxios.get<GetCoreValuesSectionResponse>("/core-values-section", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllCoreValuesSections(signal?: AbortSignal): Promise<GetAllCoreValuesSectionsResponse> {
    try {
      const response = await clientAxios.get<GetAllCoreValuesSectionsResponse>("/core-values-section/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getCoreValuesSectionById(id: string): Promise<GetCoreValuesSectionByIdResponse> {
    try {
      const response = await clientAxios.get<GetCoreValuesSectionByIdResponse>(`/core-values-section/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createOrUpdateCoreValuesSection(payload: CreateOrUpdateCoreValuesSectionPayload): Promise<CreateOrUpdateCoreValuesSectionResponse> {
    try {
      const response = await clientAxios.post<CreateOrUpdateCoreValuesSectionResponse>(
        "/core-values-section",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateCoreValuesSection(
    id: string,
    payload: UpdateCoreValuesSectionPayload
  ): Promise<UpdateCoreValuesSectionResponse> {
    try {
      const response = await clientAxios.put<UpdateCoreValuesSectionResponse>(
        `/core-values-section/${id}`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteCoreValuesSection(id: string): Promise<DeleteCoreValuesSectionResponse> {
    try {
      const response = await clientAxios.delete<DeleteCoreValuesSectionResponse>(
        `/core-values-section/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/core-values-section/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const coreValuesSectionService = new CoreValuesSectionService();


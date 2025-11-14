'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface CoreValue {
  _id: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetCoreValuesResponse = ApiResponse<CoreValue[]>;
export type GetCoreValueByIdResponse = ApiResponse<CoreValue>;

export interface CreateCoreValuePayload {
  title: string;
  description: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateCoreValuePayload {
  title?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface ReorderCoreValuesPayload {
  coreValues: Array<{ id: string; order: number }>;
}

export type CreateCoreValueResponse = ApiResponse<CoreValue>;
export type UpdateCoreValueResponse = ApiResponse<CoreValue>;
export type DeleteCoreValueResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<CoreValue>;
export type ReorderCoreValuesResponse = ApiResponse<CoreValue[]>;

class CoreValueService {
  async getCoreValues(signal?: AbortSignal): Promise<GetCoreValuesResponse> {
    try {
      const response = await clientAxios.get<GetCoreValuesResponse>("/core-values", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllCoreValues(signal?: AbortSignal): Promise<GetCoreValuesResponse> {
    try {
      const response = await clientAxios.get<GetCoreValuesResponse>("/core-values/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getCoreValueById(id: string): Promise<GetCoreValueByIdResponse> {
    try {
      const response = await clientAxios.get<GetCoreValueByIdResponse>(`/core-values/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createCoreValue(payload: CreateCoreValuePayload): Promise<CreateCoreValueResponse> {
    try {
      const response = await clientAxios.post<CreateCoreValueResponse>(
        "/core-values",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateCoreValue(
    id: string,
    payload: UpdateCoreValuePayload
  ): Promise<UpdateCoreValueResponse> {
    try {
      const response = await clientAxios.put<UpdateCoreValueResponse>(
        `/core-values/${id}`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteCoreValue(id: string): Promise<DeleteCoreValueResponse> {
    try {
      const response = await clientAxios.delete<DeleteCoreValueResponse>(
        `/core-values/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/core-values/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async reorderCoreValues(payload: ReorderCoreValuesPayload): Promise<ReorderCoreValuesResponse> {
    try {
      const response = await clientAxios.patch<ReorderCoreValuesResponse>(
        "/core-values/reorder",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const coreValueService = new CoreValueService();


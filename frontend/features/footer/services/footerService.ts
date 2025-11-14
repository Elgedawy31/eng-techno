'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface Footer {
  _id: string;
  mainTitle: string;
  subtitle: string;
  email: string;
  phone: string;
  officeLocations: string;
  buttonText: string;
  buttonAction?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetFooterResponse = ApiResponse<Footer | null>;
export type GetFootersResponse = ApiResponse<Footer[]>;
export type GetFooterByIdResponse = ApiResponse<Footer>;

export interface CreateOrUpdateFooterPayload {
  mainTitle: string;
  subtitle: string;
  email: string;
  phone: string;
  officeLocations: string;
  buttonText: string;
  buttonAction?: string;
  isActive?: boolean;
}

export interface UpdateFooterPayload {
  mainTitle?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  officeLocations?: string;
  buttonText?: string;
  buttonAction?: string;
  isActive?: boolean;
}

export type CreateOrUpdateFooterResponse = ApiResponse<Footer>;
export type UpdateFooterResponse = ApiResponse<Footer>;
export type DeleteFooterResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<Footer>;

class FooterService {
  async getFooter(signal?: AbortSignal): Promise<GetFooterResponse> {
    try {
      const response = await clientAxios.get<GetFooterResponse>("/footer", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllFooters(signal?: AbortSignal): Promise<GetFootersResponse> {
    try {
      const response = await clientAxios.get<GetFootersResponse>("/footer/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getFooterById(id: string): Promise<GetFooterByIdResponse> {
    try {
      const response = await clientAxios.get<GetFooterByIdResponse>(`/footer/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createOrUpdateFooter(payload: CreateOrUpdateFooterPayload): Promise<CreateOrUpdateFooterResponse> {
    try {
      const response = await clientAxios.post<CreateOrUpdateFooterResponse>(
        "/footer",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateFooter(
    id: string,
    payload: UpdateFooterPayload
  ): Promise<UpdateFooterResponse> {
    try {
      const response = await clientAxios.put<UpdateFooterResponse>(
        `/footer/${id}`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteFooter(id: string): Promise<DeleteFooterResponse> {
    try {
      const response = await clientAxios.delete<DeleteFooterResponse>(
        `/footer/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/footer/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const footerService = new FooterService();


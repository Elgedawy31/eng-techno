'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface ClientPartner {
  _id: string;
  name: string;
  description?: string;
  emblemImage?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetClientPartnersResponse = ApiResponse<ClientPartner[]>;
export type GetClientPartnerByIdResponse = ApiResponse<ClientPartner>;

export interface CreateClientPartnerPayload {
  name: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  emblemImage?: File;
}

export interface UpdateClientPartnerPayload {
  name?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  emblemImage?: File;
}

export interface ReorderClientPartnersPayload {
  clientPartners: Array<{ id: string; order: number }>;
}

export type CreateClientPartnerResponse = ApiResponse<ClientPartner>;
export type UpdateClientPartnerResponse = ApiResponse<ClientPartner>;
export type DeleteClientPartnerResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<ClientPartner>;
export type ReorderClientPartnersResponse = ApiResponse<ClientPartner[]>;

class ClientPartnerService {
  async getClientPartners(signal?: AbortSignal): Promise<GetClientPartnersResponse> {
    try {
      const response = await clientAxios.get<GetClientPartnersResponse>("/client-partners", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllClientPartners(signal?: AbortSignal): Promise<GetClientPartnersResponse> {
    try {
      const response = await clientAxios.get<GetClientPartnersResponse>("/client-partners/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getClientPartnerById(id: string): Promise<GetClientPartnerByIdResponse> {
    try {
      const response = await clientAxios.get<GetClientPartnerByIdResponse>(`/client-partners/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createClientPartner(payload: CreateClientPartnerPayload): Promise<CreateClientPartnerResponse> {
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      
      if (payload.description) {
        formData.append("description", payload.description);
      }
      if (payload.order !== undefined) {
        formData.append("order", payload.order.toString());
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.emblemImage) {
        formData.append("emblemImage", payload.emblemImage);
      }

      const response = await clientAxios.post<CreateClientPartnerResponse>(
        "/client-partners",
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

  async updateClientPartner(
    id: string,
    payload: UpdateClientPartnerPayload
  ): Promise<UpdateClientPartnerResponse> {
    try {
      const formData = new FormData();
      
      if (payload.name) {
        formData.append("name", payload.name);
      }
      if (payload.description !== undefined) {
        formData.append("description", payload.description);
      }
      if (payload.order !== undefined) {
        formData.append("order", payload.order.toString());
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.emblemImage) {
        formData.append("emblemImage", payload.emblemImage);
      }

      const response = await clientAxios.put<UpdateClientPartnerResponse>(
        `/client-partners/${id}`,
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

  async deleteClientPartner(id: string): Promise<DeleteClientPartnerResponse> {
    try {
      const response = await clientAxios.delete<DeleteClientPartnerResponse>(
        `/client-partners/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/client-partners/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async reorderClientPartners(payload: ReorderClientPartnersPayload): Promise<ReorderClientPartnersResponse> {
    try {
      const response = await clientAxios.patch<ReorderClientPartnersResponse>(
        "/client-partners/reorder",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const clientPartnerService = new ClientPartnerService();


'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface ClientsPartnersSection {
  _id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetClientsPartnersSectionResponse = ApiResponse<ClientsPartnersSection | null>;
export type GetAllClientsPartnersSectionsResponse = ApiResponse<ClientsPartnersSection[]>;
export type GetClientsPartnersSectionByIdResponse = ApiResponse<ClientsPartnersSection>;

export interface CreateOrUpdateClientsPartnersSectionPayload {
  title: string;
  description: string;
  isActive?: boolean;
}

export interface UpdateClientsPartnersSectionPayload {
  title?: string;
  description?: string;
  isActive?: boolean;
}

export type CreateOrUpdateClientsPartnersSectionResponse = ApiResponse<ClientsPartnersSection>;
export type UpdateClientsPartnersSectionResponse = ApiResponse<ClientsPartnersSection>;
export type DeleteClientsPartnersSectionResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<ClientsPartnersSection>;

class ClientsPartnersSectionService {
  async getClientsPartnersSection(signal?: AbortSignal): Promise<GetClientsPartnersSectionResponse> {
    try {
      const response = await clientAxios.get<GetClientsPartnersSectionResponse>("/clients-partners-section", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllClientsPartnersSections(signal?: AbortSignal): Promise<GetAllClientsPartnersSectionsResponse> {
    try {
      const response = await clientAxios.get<GetAllClientsPartnersSectionsResponse>("/clients-partners-section/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getClientsPartnersSectionById(id: string): Promise<GetClientsPartnersSectionByIdResponse> {
    try {
      const response = await clientAxios.get<GetClientsPartnersSectionByIdResponse>(`/clients-partners-section/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createOrUpdateClientsPartnersSection(payload: CreateOrUpdateClientsPartnersSectionPayload): Promise<CreateOrUpdateClientsPartnersSectionResponse> {
    try {
      const response = await clientAxios.post<CreateOrUpdateClientsPartnersSectionResponse>(
        "/clients-partners-section",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateClientsPartnersSection(
    id: string,
    payload: UpdateClientsPartnersSectionPayload
  ): Promise<UpdateClientsPartnersSectionResponse> {
    try {
      const response = await clientAxios.put<UpdateClientsPartnersSectionResponse>(
        `/clients-partners-section/${id}`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteClientsPartnersSection(id: string): Promise<DeleteClientsPartnersSectionResponse> {
    try {
      const response = await clientAxios.delete<DeleteClientsPartnersSectionResponse>(
        `/clients-partners-section/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/clients-partners-section/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const clientsPartnersSectionService = new ClientsPartnersSectionService();


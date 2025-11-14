'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface MediaCentre {
  _id: string;
  mainTitle: string;
  mainDescription: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetMediaCentreResponse = ApiResponse<MediaCentre | null>;
export type GetAllMediaCentresResponse = ApiResponse<MediaCentre[]>;
export type GetMediaCentreByIdResponse = ApiResponse<MediaCentre>;

export interface CreateOrUpdateMediaCentrePayload {
  mainTitle: string;
  mainDescription: string;
  isActive?: boolean;
}

export interface UpdateMediaCentrePayload {
  mainTitle?: string;
  mainDescription?: string;
  isActive?: boolean;
}

export type CreateOrUpdateMediaCentreResponse = ApiResponse<MediaCentre>;
export type UpdateMediaCentreResponse = ApiResponse<MediaCentre>;
export type DeleteMediaCentreResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<MediaCentre>;

class MediaCentreService {
  async getMediaCentre(signal?: AbortSignal): Promise<GetMediaCentreResponse> {
    try {
      const response = await clientAxios.get<GetMediaCentreResponse>("/media-centre", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllMediaCentres(signal?: AbortSignal): Promise<GetAllMediaCentresResponse> {
    try {
      const response = await clientAxios.get<GetAllMediaCentresResponse>("/media-centre/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getMediaCentreById(id: string): Promise<GetMediaCentreByIdResponse> {
    try {
      const response = await clientAxios.get<GetMediaCentreByIdResponse>(`/media-centre/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createOrUpdateMediaCentre(payload: CreateOrUpdateMediaCentrePayload): Promise<CreateOrUpdateMediaCentreResponse> {
    try {
      const response = await clientAxios.post<CreateOrUpdateMediaCentreResponse>(
        "/media-centre",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateMediaCentre(
    id: string,
    payload: UpdateMediaCentrePayload
  ): Promise<UpdateMediaCentreResponse> {
    try {
      const response = await clientAxios.put<UpdateMediaCentreResponse>(
        `/media-centre/${id}`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteMediaCentre(id: string): Promise<DeleteMediaCentreResponse> {
    try {
      const response = await clientAxios.delete<DeleteMediaCentreResponse>(
        `/media-centre/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/media-centre/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const mediaCentreService = new MediaCentreService();


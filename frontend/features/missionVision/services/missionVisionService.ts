'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface MissionVision {
  _id: string;
  missionTitle: string;
  missionDescription: string;
  missionLogoImage?: string;
  missionImage?: string;
  visionTitle: string;
  visionDescription: string;
  visionLogoImage?: string;
  visionImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetMissionVisionResponse = ApiResponse<MissionVision | null>;
export type GetAllMissionVisionsResponse = ApiResponse<MissionVision[]>;
export type GetMissionVisionByIdResponse = ApiResponse<MissionVision>;

export interface CreateOrUpdateMissionVisionPayload {
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  isActive?: boolean;
  missionLogoImage?: File;
  missionImage?: File;
  visionLogoImage?: File;
  visionImage?: File;
}

export interface UpdateMissionVisionPayload {
  missionTitle?: string;
  missionDescription?: string;
  visionTitle?: string;
  visionDescription?: string;
  isActive?: boolean;
  missionLogoImage?: File;
  missionImage?: File;
  visionLogoImage?: File;
  visionImage?: File;
}

export type CreateOrUpdateMissionVisionResponse = ApiResponse<MissionVision>;
export type UpdateMissionVisionResponse = ApiResponse<MissionVision>;
export type DeleteMissionVisionResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<MissionVision>;

class MissionVisionService {
  async getMissionVision(signal?: AbortSignal): Promise<GetMissionVisionResponse> {
    try {
      const response = await clientAxios.get<GetMissionVisionResponse>("/mission-vision", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllMissionVisions(signal?: AbortSignal): Promise<GetAllMissionVisionsResponse> {
    try {
      const response = await clientAxios.get<GetAllMissionVisionsResponse>("/mission-vision/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getMissionVisionById(id: string): Promise<GetMissionVisionByIdResponse> {
    try {
      const response = await clientAxios.get<GetMissionVisionByIdResponse>(`/mission-vision/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createOrUpdateMissionVision(payload: CreateOrUpdateMissionVisionPayload): Promise<CreateOrUpdateMissionVisionResponse> {
    try {
      const formData = new FormData();
      formData.append("missionTitle", payload.missionTitle);
      formData.append("missionDescription", payload.missionDescription);
      formData.append("visionTitle", payload.visionTitle);
      formData.append("visionDescription", payload.visionDescription);
      
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      
      if (payload.missionLogoImage) {
        formData.append("missionLogoImage", payload.missionLogoImage);
      }
      if (payload.missionImage) {
        formData.append("missionImage", payload.missionImage);
      }
      if (payload.visionLogoImage) {
        formData.append("visionLogoImage", payload.visionLogoImage);
      }
      if (payload.visionImage) {
        formData.append("visionImage", payload.visionImage);
      }

      const response = await clientAxios.post<CreateOrUpdateMissionVisionResponse>(
        "/mission-vision",
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

  async updateMissionVision(
    id: string,
    payload: UpdateMissionVisionPayload
  ): Promise<UpdateMissionVisionResponse> {
    try {
      const formData = new FormData();
      
      if (payload.missionTitle) {
        formData.append("missionTitle", payload.missionTitle);
      }
      if (payload.missionDescription) {
        formData.append("missionDescription", payload.missionDescription);
      }
      if (payload.visionTitle) {
        formData.append("visionTitle", payload.visionTitle);
      }
      if (payload.visionDescription) {
        formData.append("visionDescription", payload.visionDescription);
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.missionLogoImage) {
        formData.append("missionLogoImage", payload.missionLogoImage);
      }
      if (payload.missionImage) {
        formData.append("missionImage", payload.missionImage);
      }
      if (payload.visionLogoImage) {
        formData.append("visionLogoImage", payload.visionLogoImage);
      }
      if (payload.visionImage) {
        formData.append("visionImage", payload.visionImage);
      }

      const response = await clientAxios.put<UpdateMissionVisionResponse>(
        `/mission-vision/${id}`,
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

  async deleteMissionVision(id: string): Promise<DeleteMissionVisionResponse> {
    try {
      const response = await clientAxios.delete<DeleteMissionVisionResponse>(
        `/mission-vision/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/mission-vision/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const missionVisionService = new MissionVisionService();


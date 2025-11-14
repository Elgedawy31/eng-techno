'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface AboutPageContent {
  _id: string;
  headline: string;
  description: string;
  backgroundImage: string;
  logoImage?: string;
  secondDescription: string;
  buttonText: string;
  buttonAction?: string;
  companyProfileFile?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetAboutPageContentResponse = ApiResponse<AboutPageContent | null>;
export type GetAllAboutPageContentsResponse = ApiResponse<AboutPageContent[]>;
export type GetAboutPageContentByIdResponse = ApiResponse<AboutPageContent>;

export interface CreateOrUpdateAboutPageContentPayload {
  headline: string;
  description: string;
  secondDescription: string;
  buttonText: string;
  buttonAction?: string;
  isActive?: boolean;
  backgroundImage?: File;
  logoImage?: File;
  companyProfileFile?: File;
}

export interface UpdateAboutPageContentPayload {
  headline?: string;
  description?: string;
  secondDescription?: string;
  buttonText?: string;
  buttonAction?: string;
  isActive?: boolean;
  backgroundImage?: File;
  logoImage?: File;
  companyProfileFile?: File;
}

export type CreateOrUpdateAboutPageContentResponse = ApiResponse<AboutPageContent>;
export type UpdateAboutPageContentResponse = ApiResponse<AboutPageContent>;
export type DeleteAboutPageContentResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<AboutPageContent>;

class AboutPageContentService {
  async getAboutPageContent(signal?: AbortSignal): Promise<GetAboutPageContentResponse> {
    try {
      const response = await clientAxios.get<GetAboutPageContentResponse>("/about-page-content", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllAboutPageContents(signal?: AbortSignal): Promise<GetAllAboutPageContentsResponse> {
    try {
      const response = await clientAxios.get<GetAllAboutPageContentsResponse>("/about-page-content/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAboutPageContentById(id: string): Promise<GetAboutPageContentByIdResponse> {
    try {
      const response = await clientAxios.get<GetAboutPageContentByIdResponse>(`/about-page-content/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createOrUpdateAboutPageContent(payload: CreateOrUpdateAboutPageContentPayload): Promise<CreateOrUpdateAboutPageContentResponse> {
    try {
      const formData = new FormData();
      formData.append("headline", payload.headline);
      formData.append("description", payload.description);
      formData.append("secondDescription", payload.secondDescription);
      formData.append("buttonText", payload.buttonText);
      
      if (payload.buttonAction) {
        formData.append("buttonAction", payload.buttonAction);
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      
      if (payload.backgroundImage) {
        formData.append("backgroundImage", payload.backgroundImage);
      }
      if (payload.logoImage) {
        formData.append("logoImage", payload.logoImage);
      }
      if (payload.companyProfileFile) {
        formData.append("companyProfileFile", payload.companyProfileFile);
      }

      const response = await clientAxios.post<CreateOrUpdateAboutPageContentResponse>(
        "/about-page-content",
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

  async updateAboutPageContent(
    id: string,
    payload: UpdateAboutPageContentPayload
  ): Promise<UpdateAboutPageContentResponse> {
    try {
      const formData = new FormData();
      
      if (payload.headline) {
        formData.append("headline", payload.headline);
      }
      if (payload.description) {
        formData.append("description", payload.description);
      }
      if (payload.secondDescription) {
        formData.append("secondDescription", payload.secondDescription);
      }
      if (payload.buttonText) {
        formData.append("buttonText", payload.buttonText);
      }
      if (payload.buttonAction !== undefined) {
        formData.append("buttonAction", payload.buttonAction);
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.backgroundImage) {
        formData.append("backgroundImage", payload.backgroundImage);
      }
      if (payload.logoImage) {
        formData.append("logoImage", payload.logoImage);
      }
      if (payload.companyProfileFile) {
        formData.append("companyProfileFile", payload.companyProfileFile);
      }

      const response = await clientAxios.put<UpdateAboutPageContentResponse>(
        `/about-page-content/${id}`,
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

  async deleteAboutPageContent(id: string): Promise<DeleteAboutPageContentResponse> {
    try {
      const response = await clientAxios.delete<DeleteAboutPageContentResponse>(
        `/about-page-content/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/about-page-content/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const aboutPageContentService = new AboutPageContentService();


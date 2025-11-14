'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface AboutPageHero {
  _id: string;
  backgroundImage: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetAboutPageHeroResponse = ApiResponse<AboutPageHero | null>;
export type GetAllAboutPageHeroesResponse = ApiResponse<AboutPageHero[]>;
export type GetAboutPageHeroByIdResponse = ApiResponse<AboutPageHero>;

export interface CreateOrUpdateAboutPageHeroPayload {
  title: string;
  isActive?: boolean;
  backgroundImage?: File;
}

export interface UpdateAboutPageHeroPayload {
  title?: string;
  isActive?: boolean;
  backgroundImage?: File;
}

export type CreateOrUpdateAboutPageHeroResponse = ApiResponse<AboutPageHero>;
export type UpdateAboutPageHeroResponse = ApiResponse<AboutPageHero>;
export type DeleteAboutPageHeroResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<AboutPageHero>;

class AboutPageHeroService {
  async getAboutPageHero(signal?: AbortSignal): Promise<GetAboutPageHeroResponse> {
    try {
      const response = await clientAxios.get<GetAboutPageHeroResponse>("/about-page-hero", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllAboutPageHeroes(signal?: AbortSignal): Promise<GetAllAboutPageHeroesResponse> {
    try {
      const response = await clientAxios.get<GetAllAboutPageHeroesResponse>("/about-page-hero/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAboutPageHeroById(id: string): Promise<GetAboutPageHeroByIdResponse> {
    try {
      const response = await clientAxios.get<GetAboutPageHeroByIdResponse>(`/about-page-hero/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createOrUpdateAboutPageHero(payload: CreateOrUpdateAboutPageHeroPayload): Promise<CreateOrUpdateAboutPageHeroResponse> {
    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      
      if (payload.backgroundImage) {
        formData.append("backgroundImage", payload.backgroundImage);
      }

      const response = await clientAxios.post<CreateOrUpdateAboutPageHeroResponse>(
        "/about-page-hero",
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

  async updateAboutPageHero(
    id: string,
    payload: UpdateAboutPageHeroPayload
  ): Promise<UpdateAboutPageHeroResponse> {
    try {
      const formData = new FormData();
      
      if (payload.title) {
        formData.append("title", payload.title);
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.backgroundImage) {
        formData.append("backgroundImage", payload.backgroundImage);
      }

      const response = await clientAxios.put<UpdateAboutPageHeroResponse>(
        `/about-page-hero/${id}`,
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

  async deleteAboutPageHero(id: string): Promise<DeleteAboutPageHeroResponse> {
    try {
      const response = await clientAxios.delete<DeleteAboutPageHeroResponse>(
        `/about-page-hero/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/about-page-hero/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const aboutPageHeroService = new AboutPageHeroService();


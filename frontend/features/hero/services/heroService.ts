'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface Hero {
  _id: string;
  backgroundImage: string;
  headline: string;
  subtitle: string;
  buttonText: string;
  buttonAction: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetHeroResponse = ApiResponse<Hero | null>;
export type GetAllHeroesResponse = ApiResponse<Hero[]>;
export type GetHeroByIdResponse = ApiResponse<Hero>;

export interface CreateOrUpdateHeroPayload {
  headline: string;
  subtitle: string;
  buttonText: string;
  buttonAction: string;
  isActive?: boolean;
  backgroundImage?: File;
}

export interface UpdateHeroPayload {
  headline?: string;
  subtitle?: string;
  buttonText?: string;
  buttonAction?: string;
  isActive?: boolean;
  backgroundImage?: File;
}

export interface CreateOrUpdateHeroData {
  hero: Hero;
}

export interface UpdateHeroData {
  hero: Hero;
}

export type CreateOrUpdateHeroResponse = ApiResponse<CreateOrUpdateHeroData>;
export type UpdateHeroResponse = ApiResponse<UpdateHeroData>;
export type DeleteHeroResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<Hero>;

class HeroService {
  async getHero(signal?: AbortSignal): Promise<GetHeroResponse> {
    try {
      const response = await clientAxios.get<GetHeroResponse>("/hero", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllHeroes(signal?: AbortSignal): Promise<GetAllHeroesResponse> {
    try {
      const response = await clientAxios.get<GetAllHeroesResponse>("/hero/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getHeroById(id: string): Promise<GetHeroByIdResponse> {
    try {
      const response = await clientAxios.get<GetHeroByIdResponse>(`/hero/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createOrUpdateHero(payload: CreateOrUpdateHeroPayload): Promise<CreateOrUpdateHeroResponse> {
    try {
      const formData = new FormData();
      formData.append("headline", payload.headline);
      formData.append("subtitle", payload.subtitle);
      formData.append("buttonText", payload.buttonText);
      formData.append("buttonAction", payload.buttonAction);
      
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      
      if (payload.backgroundImage) {
        formData.append("backgroundImage", payload.backgroundImage);
      }

      const response = await clientAxios.post<CreateOrUpdateHeroResponse>(
        "/hero",
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

  async updateHero(
    id: string,
    payload: UpdateHeroPayload
  ): Promise<UpdateHeroResponse> {
    try {
      const formData = new FormData();
      
      if (payload.headline) {
        formData.append("headline", payload.headline);
      }
      if (payload.subtitle) {
        formData.append("subtitle", payload.subtitle);
      }
      if (payload.buttonText) {
        formData.append("buttonText", payload.buttonText);
      }
      if (payload.buttonAction) {
        formData.append("buttonAction", payload.buttonAction);
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.backgroundImage) {
        formData.append("backgroundImage", payload.backgroundImage);
      }

      const response = await clientAxios.put<UpdateHeroResponse>(
        `/hero/${id}`,
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

  async deleteHero(id: string): Promise<DeleteHeroResponse> {
    try {
      const response = await clientAxios.delete<DeleteHeroResponse>(
        `/hero/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/hero/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const heroService = new HeroService();


'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface About {
  _id: string;
  label: string;
  description: string;
  button1Text: string;
  button1Action: string;
  button2Text: string;
  button2Action: string;
  companyProfileFile: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetAboutResponse = ApiResponse<About | null>;
export type GetAllAboutsResponse = ApiResponse<About[]>;
export type GetAboutByIdResponse = ApiResponse<About>;

export interface CreateOrUpdateAboutPayload {
  label?: string;
  description: string;
  button1Text: string;
  button1Action: string;
  button2Text: string;
  button2Action?: string;
  isActive?: boolean;
  companyProfileFile?: File;
}

export interface UpdateAboutPayload {
  label?: string;
  description?: string;
  button1Text?: string;
  button1Action?: string;
  button2Text?: string;
  button2Action?: string;
  isActive?: boolean;
  companyProfileFile?: File;
}

export type CreateOrUpdateAboutData = About;
export type UpdateAboutData = About;

export type CreateOrUpdateAboutResponse = ApiResponse<CreateOrUpdateAboutData>;
export type UpdateAboutResponse = ApiResponse<UpdateAboutData>;
export type DeleteAboutResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<About>;

class AboutService {
  async getAbout(signal?: AbortSignal): Promise<GetAboutResponse> {
    try {
      const response = await clientAxios.get<GetAboutResponse>("/about", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllAbouts(signal?: AbortSignal): Promise<GetAllAboutsResponse> {
    try {
      const response = await clientAxios.get<GetAllAboutsResponse>("/about/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAboutById(id: string): Promise<GetAboutByIdResponse> {
    try {
      const response = await clientAxios.get<GetAboutByIdResponse>(`/about/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createOrUpdateAbout(payload: CreateOrUpdateAboutPayload): Promise<CreateOrUpdateAboutResponse> {
    try {
      const formData = new FormData();
      
      if (payload.label !== undefined) {
        formData.append("label", payload.label);
      }
      formData.append("description", payload.description);
      formData.append("button1Text", payload.button1Text);
      formData.append("button1Action", payload.button1Action);
      formData.append("button2Text", payload.button2Text);
      
      if (payload.button2Action !== undefined) {
        formData.append("button2Action", payload.button2Action);
      }
      
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      
      if (payload.companyProfileFile) {
        formData.append("companyProfileFile", payload.companyProfileFile);
      }

      const response = await clientAxios.post<CreateOrUpdateAboutResponse>(
        "/about",
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

  async updateAbout(
    id: string,
    payload: UpdateAboutPayload
  ): Promise<UpdateAboutResponse> {
    try {
      const formData = new FormData();
      
      if (payload.label !== undefined) {
        formData.append("label", payload.label);
      }
      if (payload.description) {
        formData.append("description", payload.description);
      }
      if (payload.button1Text) {
        formData.append("button1Text", payload.button1Text);
      }
      if (payload.button1Action) {
        formData.append("button1Action", payload.button1Action);
      }
      if (payload.button2Text) {
        formData.append("button2Text", payload.button2Text);
      }
      if (payload.button2Action !== undefined) {
        formData.append("button2Action", payload.button2Action);
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.companyProfileFile) {
        formData.append("companyProfileFile", payload.companyProfileFile);
      }

      const response = await clientAxios.put<UpdateAboutResponse>(
        `/about/${id}`,
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

  async deleteAbout(id: string): Promise<DeleteAboutResponse> {
    try {
      const response = await clientAxios.delete<DeleteAboutResponse>(
        `/about/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/about/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const aboutService = new AboutService();


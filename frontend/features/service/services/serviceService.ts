'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface Service {
  _id: string;
  title: string;
  description: string;
  backgroundImage: string;
  categoryTags: string[];
  buttonText: string;
  buttonAction: string;
  additionalText?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetServicesResponse = ApiResponse<Service[]>;
export type GetServiceByIdResponse = ApiResponse<Service>;

export interface CreateServicePayload {
  title: string;
  description: string;
  categoryTags?: string[];
  buttonText: string;
  buttonAction: string;
  additionalText?: string;
  order?: number;
  isActive?: boolean;
  backgroundImage: File;
}

export interface UpdateServicePayload {
  title?: string;
  description?: string;
  categoryTags?: string[];
  buttonText?: string;
  buttonAction?: string;
  additionalText?: string;
  order?: number;
  isActive?: boolean;
  backgroundImage?: File;
}

export interface ReorderServicesPayload {
  services: Array<{ id: string; order: number }>;
}

export type CreateServiceResponse = ApiResponse<Service>;
export type UpdateServiceResponse = ApiResponse<Service>;
export type DeleteServiceResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<Service>;
export type ReorderServicesResponse = ApiResponse<Service[]>;

class ServiceService {
  async getServices(signal?: AbortSignal): Promise<GetServicesResponse> {
    try {
      const response = await clientAxios.get<GetServicesResponse>("/services", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllServices(signal?: AbortSignal): Promise<GetServicesResponse> {
    try {
      const response = await clientAxios.get<GetServicesResponse>("/services/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getServiceById(id: string): Promise<GetServiceByIdResponse> {
    try {
      const response = await clientAxios.get<GetServiceByIdResponse>(`/services/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createService(payload: CreateServicePayload): Promise<CreateServiceResponse> {
    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("buttonText", payload.buttonText);
      formData.append("buttonAction", payload.buttonAction);
      
      if (payload.categoryTags && payload.categoryTags.length > 0) {
        formData.append("categoryTags", JSON.stringify(payload.categoryTags));
      }
      
      if (payload.additionalText) {
        formData.append("additionalText", payload.additionalText);
      }
      
      if (payload.order !== undefined) {
        formData.append("order", payload.order.toString());
      }
      
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      
      if (payload.backgroundImage) {
        formData.append("backgroundImage", payload.backgroundImage);
      }

      const response = await clientAxios.post<CreateServiceResponse>(
        "/services",
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

  async updateService(
    id: string,
    payload: UpdateServicePayload
  ): Promise<UpdateServiceResponse> {
    try {
      const formData = new FormData();
      
      if (payload.title) {
        formData.append("title", payload.title);
      }
      if (payload.description) {
        formData.append("description", payload.description);
      }
      if (payload.buttonText) {
        formData.append("buttonText", payload.buttonText);
      }
      if (payload.buttonAction) {
        formData.append("buttonAction", payload.buttonAction);
      }
      if (payload.categoryTags !== undefined) {
        formData.append("categoryTags", JSON.stringify(payload.categoryTags));
      }
      if (payload.additionalText !== undefined) {
        formData.append("additionalText", payload.additionalText || "");
      }
      if (payload.order !== undefined) {
        formData.append("order", payload.order.toString());
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.backgroundImage) {
        formData.append("backgroundImage", payload.backgroundImage);
      }

      const response = await clientAxios.put<UpdateServiceResponse>(
        `/services/${id}`,
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

  async deleteService(id: string): Promise<DeleteServiceResponse> {
    try {
      const response = await clientAxios.delete<DeleteServiceResponse>(
        `/services/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/services/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async reorderServices(payload: ReorderServicesPayload): Promise<ReorderServicesResponse> {
    try {
      const response = await clientAxios.patch<ReorderServicesResponse>(
        "/services/reorder",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const serviceService = new ServiceService();


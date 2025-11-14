'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface ComplianceQuality {
  _id: string;
  title: string;
  firstDescription: string;
  logoImage?: string;
  displayImage?: string;
  secondDescription: string;
  buttonText: string;
  buttonAction?: string;
  companyProfileFile?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetComplianceQualityResponse = ApiResponse<ComplianceQuality | null>;
export type GetAllComplianceQualitiesResponse = ApiResponse<ComplianceQuality[]>;
export type GetComplianceQualityByIdResponse = ApiResponse<ComplianceQuality>;

export interface CreateOrUpdateComplianceQualityPayload {
  title: string;
  firstDescription: string;
  secondDescription: string;
  buttonText: string;
  buttonAction?: string;
  isActive?: boolean;
  logoImage?: File;
  displayImage?: File;
  companyProfileFile?: File;
}

export interface UpdateComplianceQualityPayload {
  title?: string;
  firstDescription?: string;
  secondDescription?: string;
  buttonText?: string;
  buttonAction?: string;
  isActive?: boolean;
  logoImage?: File;
  displayImage?: File;
  companyProfileFile?: File;
}

export type CreateOrUpdateComplianceQualityResponse = ApiResponse<ComplianceQuality>;
export type UpdateComplianceQualityResponse = ApiResponse<ComplianceQuality>;
export type DeleteComplianceQualityResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<ComplianceQuality>;

class ComplianceQualityService {
  async getComplianceQuality(signal?: AbortSignal): Promise<GetComplianceQualityResponse> {
    try {
      const response = await clientAxios.get<GetComplianceQualityResponse>("/compliance-quality", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllComplianceQualities(signal?: AbortSignal): Promise<GetAllComplianceQualitiesResponse> {
    try {
      const response = await clientAxios.get<GetAllComplianceQualitiesResponse>("/compliance-quality/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getComplianceQualityById(id: string): Promise<GetComplianceQualityByIdResponse> {
    try {
      const response = await clientAxios.get<GetComplianceQualityByIdResponse>(`/compliance-quality/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createOrUpdateComplianceQuality(payload: CreateOrUpdateComplianceQualityPayload): Promise<CreateOrUpdateComplianceQualityResponse> {
    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("firstDescription", payload.firstDescription);
      formData.append("secondDescription", payload.secondDescription);
      formData.append("buttonText", payload.buttonText);
      
      if (payload.buttonAction) {
        formData.append("buttonAction", payload.buttonAction);
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.logoImage) {
        formData.append("logoImage", payload.logoImage);
      }
      if (payload.displayImage) {
        formData.append("displayImage", payload.displayImage);
      }
      if (payload.companyProfileFile) {
        formData.append("companyProfileFile", payload.companyProfileFile);
      }

      const response = await clientAxios.post<CreateOrUpdateComplianceQualityResponse>(
        "/compliance-quality",
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

  async updateComplianceQuality(
    id: string,
    payload: UpdateComplianceQualityPayload
  ): Promise<UpdateComplianceQualityResponse> {
    try {
      const formData = new FormData();
      
      if (payload.title) {
        formData.append("title", payload.title);
      }
      if (payload.firstDescription) {
        formData.append("firstDescription", payload.firstDescription);
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
      if (payload.logoImage) {
        formData.append("logoImage", payload.logoImage);
      }
      if (payload.displayImage) {
        formData.append("displayImage", payload.displayImage);
      }
      if (payload.companyProfileFile) {
        formData.append("companyProfileFile", payload.companyProfileFile);
      }

      const response = await clientAxios.put<UpdateComplianceQualityResponse>(
        `/compliance-quality/${id}`,
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

  async deleteComplianceQuality(id: string): Promise<DeleteComplianceQualityResponse> {
    try {
      const response = await clientAxios.delete<DeleteComplianceQualityResponse>(
        `/compliance-quality/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/compliance-quality/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const complianceQualityService = new ComplianceQualityService();


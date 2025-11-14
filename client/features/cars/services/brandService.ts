'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  GetAllBrandsResponse,
  GetBrandResponse,
  CreateBrandPayload,
  CreateBrandResponse,
  UpdateBrandPayload,
  UpdateBrandResponse,
  DeleteBrandResponse,
} from "../types/brand.types";

class BrandService {
  async getAllBrands(
    page: number = 1,
    limit: number = 10,
    signal?: AbortSignal
  ): Promise<GetAllBrandsResponse> {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      const response = await clientAxios.get<GetAllBrandsResponse>("/brands", {
        params,
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getBrandById(id: string): Promise<GetBrandResponse> {
    try {
      const response = await clientAxios.get<GetBrandResponse>(`/brands/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createBrand(payload: CreateBrandPayload): Promise<CreateBrandResponse> {
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      if (payload.image) formData.append("image", payload.image);

      const response = await clientAxios.post<CreateBrandResponse>(
        "/brands",
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

  async updateBrand(
    id: string,
    payload: UpdateBrandPayload
  ): Promise<UpdateBrandResponse> {
    try {
      const formData = new FormData();
      if (payload.name) formData.append("name", payload.name);
      if (payload.image) formData.append("image", payload.image);

      const response = await clientAxios.put<UpdateBrandResponse>(
        `/brands/${id}`,
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

  async deleteBrand(id: string): Promise<DeleteBrandResponse> {
    try {
      const response = await clientAxios.delete<DeleteBrandResponse>(
        `/brands/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const brandService = new BrandService();

